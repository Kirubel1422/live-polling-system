import { AppDataSource } from "src/configs/database";
import { PresentationEntity } from "src/entities/Presentation.entity";
import { SlideEntity, SlideSettingsJson } from "src/entities/Slide.entity";
import { SlideOptionEntity } from "src/entities/SlideOption.entity";
import { ApiError } from "src/utils/api/api.response";
import logger from "src/utils/logger/logger";
import {
  CreateSlideDto,
  UpdateSlideDto,
  ReorderSlidesDto,
} from "src/validators/slide.validator";
import { CacheService } from "src/utils/cache/cache.service";
import { CacheKeys } from "src/utils/cache/cache.keys";

const SLIDE_CACHE_TTL = 120; // 2 minutes

/** Slide types that require at least one option row */
const CHOICE_SLIDE_TYPES = new Set([
  "multiple-choice",
  "quiz",
  "ranking",
  "image-choice",
  "100-points",
]);

export class SlideService {
  private slideRepo = AppDataSource.getRepository(SlideEntity);
  private presentationRepo = AppDataSource.getRepository(PresentationEntity);

  constructor() {
    this.create = this.create.bind(this);
    this.findAllByPresentation = this.findAllByPresentation.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.reorder = this.reorder.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  /** Invalidate slide and parent presentation caches */
  private async invalidateSlideCache(presentationId: string): Promise<void> {
    await CacheService.deleteKey(CacheKeys.slidesByPresentationId(presentationId));
    await CacheService.deletePattern(`slide:${presentationId}:*`);
    await CacheService.deleteKey(CacheKeys.presentationById(presentationId));
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Verify the presentation exists and return it.
   * Throws 404 if not found.
   */
  private async assertPresentation(
    presentationId: string,
    ownerId?: string
  ): Promise<PresentationEntity> {
    const presentation = await this.presentationRepo.findOne({
      where: { id: presentationId },
    });
    if (!presentation) {
      throw new ApiError("Presentation not found", 404, false);
    }
    if (ownerId && presentation.ownerId && presentation.ownerId !== ownerId) {
      logger.error(`[SlideService.assertPresentation] Access denied. User ${ownerId} attempted to access presentation ${presentationId} owned by ${presentation.ownerId}`);
      throw new ApiError(`Forbidden. You do not have permission to modify this presentation.`, 403, false);
    }
    return presentation;
  }

  /**
   * Load a single slide with its options, asserting it belongs to the given presentation.
   */
  private async findSlideWithOptions(
    slideId: string,
    presentationId: string,
    ownerId?: string
  ): Promise<SlideEntity> {
    await this.assertPresentation(presentationId, ownerId);

    const slide = await CacheService.remember(
      CacheKeys.slideById(presentationId, slideId),
      SLIDE_CACHE_TTL,
      () => this.slideRepo
        .createQueryBuilder("slide")
        .leftJoinAndSelect("slide.options", "option")
        .leftJoinAndSelect("slide.responses", "response")
        .where("slide.id = :slideId", { slideId })
        .andWhere("slide.presentationId = :presentationId", { presentationId })
        .orderBy("option.order", "ASC")
        .addOrderBy("response.createdAt", "ASC")
        .getOne()
    );

    if (!slide) {
      throw new ApiError("Slide not found", 404, false);
    }
    return slide;
  }



  /**
   * Create a new slide (and its options) for a presentation.
   * If no `order` is specified, the slide is appended at the end.
   */
  async create(
    presentationId: string,
    dto: CreateSlideDto,
    ownerId?: string
  ): Promise<SlideEntity> {
    await this.assertPresentation(presentationId, ownerId);

    // Validate that choice-based slides have at least one option
    if (CHOICE_SLIDE_TYPES.has(dto.type) && (!dto.options || dto.options.length === 0)) {
      throw new ApiError(
        `Slide type "${dto.type}" requires at least one option.`,
        400,
        false
      );
    }

    return AppDataSource.manager.transaction(async (manager) => {
      const { options, meta, ...slideFields } = dto;

      const slide = manager.create(SlideEntity, {
        ...slideFields,
        meta: meta ?? {},
        presentationId,
      });
      const savedSlide = await manager.save(slide);

      if (options && options.length > 0) {
        const optionEntities = options.map((opt, idx) =>
          manager.create(SlideOptionEntity, {
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect ?? false,
            color: opt.color,
            imageUrl: opt.imageUrl,
            votes: opt.votes ?? 0,
            order: idx,
            slideId: savedSlide.id,
          })
        );
        await manager.save(optionEntities);
      }

      logger.info(`Slide created: ${savedSlide.id} (type: ${dto.type})`);
      await this.invalidateSlideCache(presentationId);
      return this.findSlideWithOptions(savedSlide.id, presentationId);
    });
  }

  /**
   * Fetch all slides for a presentation, ordered by `order` ASC.
   */
  async findAllByPresentation(presentationId: string, ownerId?: string): Promise<SlideEntity[]> {
    await this.assertPresentation(presentationId, ownerId);

    return CacheService.remember(
      CacheKeys.slidesByPresentationId(presentationId),
      SLIDE_CACHE_TTL,
      () => this.slideRepo
        .createQueryBuilder("slide")
        .leftJoinAndSelect("slide.options", "option")
        .leftJoinAndSelect("slide.responses", "response")
        .where("slide.presentationId = :presentationId", { presentationId })
        .orderBy("slide.order", "ASC")
        .addOrderBy("option.order", "ASC")
        .addOrderBy("response.createdAt", "ASC")
        .getMany()
    );
  }

  /**
   * Fetch a single slide by ID (within a presentation).
   */
  async findOne(
    slideId: string,
    presentationId: string,
    ownerId?: string
  ): Promise<SlideEntity> {
    return this.findSlideWithOptions(slideId, presentationId, ownerId);
  }

  /**
   * Update a slide's content, theme, settings, options, or meta.
   * When `options` is provided, it replaces the existing option rows entirely.
   */
  async update(
    slideId: string,
    presentationId: string,
    dto: UpdateSlideDto,
    ownerId?: string
  ): Promise<SlideEntity> {
    const slide = await this.findSlideWithOptions(slideId, presentationId, ownerId);

    return AppDataSource.manager.transaction(async (manager) => {
      const { options, meta, ...scalarFields } = dto;
      console.log("SCALAR FIELDS RECIEVED:", scalarFields);
      console.log("META RECIEVED:", meta);
      // Update scalar fields manually to guarantee assignment
      Object.assign(slide, scalarFields);

      // Deep merge meta fields safely
      if (meta !== undefined) {
        slide.meta = { ...slide.meta, ...meta };
      }

      await manager.save(SlideEntity, slide);

      // Replace options if provided
      if (options !== undefined) {
        // Delete existing options
        await manager
          .createQueryBuilder()
          .delete()
          .from(SlideOptionEntity)
          .where("slideId = :slideId", { slideId })
          .execute();

        // Re-insert
        if (options && options.length > 0) {
          const optionEntities = options.map((opt, idx) =>
            manager.create(SlideOptionEntity, {
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect ?? false,
              color: opt.color,
              imageUrl: opt.imageUrl,
              votes: opt.votes ?? 0,
              order: idx,
              slideId,
            })
          );
          await manager.save(optionEntities);
        }

        logger.info(`Slide ${slideId} options updated (${options?.length || 0} options)`);
      }

      await this.invalidateSlideCache(presentationId);
      return this.findSlideWithOptions(slideId, presentationId);
    });
  }

  /**
   * Delete a slide and all its options (CASCADE handles options).
   * After deletion, re-normalises the order of remaining slides.
   */
  async remove(slideId: string, presentationId: string, ownerId?: string): Promise<void> {
    await this.findSlideWithOptions(slideId, presentationId, ownerId);

    await AppDataSource.manager.transaction(async (manager) => {
      await manager.delete(SlideEntity, slideId);

      // Re-normalise order for remaining slides
      const remaining = await manager
        .createQueryBuilder(SlideEntity, "slide")
        .where("slide.presentationId = :presentationId", { presentationId })
        .orderBy("slide.order", "ASC")
        .getMany();

      for (let i = 0; i < remaining.length; i++) {
        remaining[i].order = i;
      }
      await manager.save(remaining);
    });

    logger.info(`Slide deleted: ${slideId}`);
    await this.invalidateSlideCache(presentationId);
  }

  /**
   * Reorder slides within a presentation.
   * Accepts an ordered array of slide IDs and updates `order` accordingly.
   * This mirrors the frontend drag-and-drop reorderSlides action.
   */
  async reorder(
    presentationId: string,
    dto: ReorderSlidesDto,
    ownerId?: string
  ): Promise<SlideEntity[]> {
    await this.assertPresentation(presentationId, ownerId);

    const slides = await this.slideRepo.find({
      where: { presentationId },
    });

    // Validate that all provided IDs belong to this presentation
    const slideMap = new Map(slides.map((s) => [s.id, s]));
    for (const id of dto.slideIds) {
      if (!slideMap.has(id)) {
        throw new ApiError(`Slide ID "${id}" not found in this presentation.`, 400, false);
      }
    }

    // Apply new order
    await AppDataSource.manager.transaction(async (manager) => {
      for (let i = 0; i < dto.slideIds.length; i++) {
        const slide = slideMap.get(dto.slideIds[i])!;
        slide.order = i;
        await manager.save(slide);
      }
    });

    logger.info(`Slides reordered for presentation: ${presentationId}`);
    await this.invalidateSlideCache(presentationId);
    return this.findAllByPresentation(presentationId);
  }

  /**
   * Patch only the settings JSONB of a slide.
   * Merges the incoming partial settings with the existing ones atomically.
   */
  async updateSettings(
    slideId: string,
    presentationId: string,
    settings: Partial<SlideSettingsJson>,
    ownerId?: string
  ): Promise<SlideEntity> {
    const slide = await this.findSlideWithOptions(slideId, presentationId, ownerId);

    slide.settings = { ...slide.settings, ...settings };
    await this.slideRepo.save(slide);

    logger.info(`Slide ${slideId} settings updated`);
    await this.invalidateSlideCache(presentationId);
    return this.findSlideWithOptions(slideId, presentationId);
  }

  /**
   * Duplicate a single slide (deep copy with new IDs).

   * The clone is inserted immediately AFTER the parent slide;
   * all subsequent slides are shifted up by 1.
   */
  async duplicate(
    slideId: string,
    presentationId: string,
    ownerId?: string
  ): Promise<SlideEntity> {
    const original = await this.findSlideWithOptions(slideId, presentationId, ownerId);
    const insertAtOrder = original.order + 1;

    let newSlideId: string;

    await AppDataSource.manager.transaction(async (manager) => {
      // Shift every slide at or beyond the insertion point up by 1
      await manager
        .createQueryBuilder()
        .update(SlideEntity)
        .set({ order: () => `"order" + 1` })
        .where('presentationId = :presentationId AND "order" >= :insertAtOrder', {
          presentationId,
          insertAtOrder,
        })
        .execute();

      // Insert the duplicate at the freed-up position
      const newSlide = manager.create(SlideEntity, {
        type: original.type,
        title: `${original.title} (Copy)`,
        subtitle: original.subtitle,
        order: insertAtOrder,
        theme: { ...original.theme },
        settings: { ...original.settings },
        meta: { ...original.meta },
        presentationId,
      });
      const savedSlide = await manager.save(newSlide);
      newSlideId = savedSlide.id;

      if (original.options && original.options.length > 0) {
        const optionEntities = original.options.map((opt, idx) =>
          manager.create(SlideOptionEntity, {
            text: opt.text,
            isCorrect: opt.isCorrect,
            color: opt.color,
            imageUrl: opt.imageUrl,
            votes: 0, // reset votes on duplicate
            order: idx,
            slideId: savedSlide.id,
          })
        );
        await manager.save(optionEntities);
      }

      logger.info(`Slide duplicated: ${slideId} → ${savedSlide.id} at order ${insertAtOrder}`);
    });

    await this.invalidateSlideCache(presentationId);
    // Fetch AFTER the transaction commits so this.slideRepo can see the new row
    return this.findSlideWithOptions(newSlideId!, presentationId);
  }
}
