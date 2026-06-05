import { AppDataSource } from "src/configs/database";
import { PresentationEntity } from "src/entities/Presentation.entity";
import { SlideEntity } from "src/entities/Slide.entity";
import { SlideOptionEntity } from "src/entities/SlideOption.entity";
import { ApiError } from "src/utils/api/api.response";
import { CreatePresentationDto, UpdatePresentationDto } from "src/validators/presentation.validator";
import logger from "src/utils/logger/logger";
import { CacheService } from "src/utils/cache/cache.service";
import { CacheKeys } from "src/utils/cache/cache.keys";

const PRESENTATION_CACHE_TTL = 120; // 2 minutes

export class PresentationService {
  private presentationRepo = AppDataSource.getRepository(PresentationEntity);

  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.updateTheme = this.updateTheme.bind(this);
    this.reorderSlides = this.reorderSlides.bind(this);
  }

  /** Invalidate all caches related to a presentation */
  private async invalidatePresentation(id: string, ownerId?: string): Promise<void> {
    await CacheService.deleteKey(CacheKeys.presentationById(id));
    await CacheService.deletePattern(CacheKeys.slidesByPresentationId(id));
    await CacheService.deletePattern(`slide:${id}:*`);
    if (ownerId) {
      await CacheService.deleteKey(CacheKeys.presentationListByOwner(ownerId));
    }
  }

  /**
   * Create a new presentation with its slides and options in one transaction.
   */
  async create(dto: CreatePresentationDto, ownerId?: string): Promise<PresentationEntity> {
    const presentationId = await AppDataSource.manager.transaction(async (manager) => {
      // Generate join code (4 letters, 2 numbers)
      let joinCode = "";
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      for (let i = 0; i < 4; i++) joinCode += letters.charAt(Math.floor(Math.random() * letters.length));
      for (let i = 0; i < 2; i++) joinCode += numbers.charAt(Math.floor(Math.random() * numbers.length));

      // 1. Create the presentation row
      const presentation = manager.create(PresentationEntity, {
        title: dto.title,
        description: dto.description,
        thumbnail: dto.thumbnail,
        status: dto.status,
        theme: dto.theme,
        templateId: dto.templateId,
        isAIGenerated: dto.isAIGenerated,
        ownerId,
        joinCode,
      });
      const savedPresentation = await manager.save(presentation);
      logger.info(`Presentation created: ${savedPresentation.id}. Attempting to process ${dto.slides?.length || 0} slides.`);

      // 2. Create slides + their options
      if (dto.slides && dto.slides.length > 0) {
        for (const slideDto of dto.slides) {
          const { id, options, meta, ...slideFields } = slideDto;

          const slide = manager.create(SlideEntity, {
            ...slideFields,
            meta: meta ?? {},
            presentationId: savedPresentation.id,
          });
          const savedSlide = await manager.save(slide);

          // 3. Create options for choice-based slides
          if (options && options.length > 0) {
            const slideOptions = options.map((opt, idx) => {
              const { id: optId, ...optFields } = opt;
              return manager.create(SlideOptionEntity, {
                ...optFields,
                color: opt.color,
                imageUrl: opt.imageUrl,
                votes: opt.votes ?? 0,
                order: idx,
                slideId: savedSlide.id,
              });
            });
            await manager.save(slideOptions);
          }
        }
      }

      return savedPresentation.id;
    });

    logger.info(`Presentation ${presentationId} successfully processed and committed.`);

    // Invalidate owner list cache
    if (ownerId) {
      await CacheService.deleteKey(CacheKeys.presentationListByOwner(ownerId));
    }

    return this.findOne(presentationId);
  }

  /**
   * Fetch all presentations. Optionally filter by ownerId once auth is wired.
   */
  async findAll(ownerId?: string): Promise<PresentationEntity[]> {
    if (ownerId) {
      return CacheService.remember(
        CacheKeys.presentationListByOwner(ownerId),
        PRESENTATION_CACHE_TTL,
        () => this._findAllFromDb(ownerId)
      );
    }
    return this._findAllFromDb();
  }

  private async _findAllFromDb(ownerId?: string): Promise<PresentationEntity[]> {
    const query = this.presentationRepo
      .createQueryBuilder("presentation")
      .leftJoinAndSelect("presentation.slides", "slide")
      .leftJoinAndSelect("slide.options", "option")
      .leftJoinAndSelect("slide.responses", "response")
      .orderBy("presentation.createdAt", "DESC")
      .addOrderBy("slide.order", "ASC")
      .addOrderBy("option.order", "ASC")
      .addOrderBy("response.createdAt", "ASC");

    if (ownerId) {
      query.where("presentation.ownerId = :ownerId", { ownerId });
    }

    return query.getMany();
  }

  /**
   * Fetch a single presentation by ID — with all slides and options.
   */
  async findOne(id: string, ownerId?: string): Promise<PresentationEntity> {
    const presentation = await CacheService.remember(
      CacheKeys.presentationById(id),
      PRESENTATION_CACHE_TTL,
      async () => {
        return this.presentationRepo
          .createQueryBuilder("presentation")
          .leftJoinAndSelect("presentation.slides", "slide")
          .leftJoinAndSelect("slide.options", "option")
          .leftJoinAndSelect("slide.responses", "response")
          .where("presentation.id = :id", { id })
          .orderBy("slide.order", "ASC")
          .addOrderBy("option.order", "ASC")
          .addOrderBy("response.createdAt", "ASC")
          .getOne();
      }
    );

    if (!presentation) {
      logger.error(`[PresentationService.findOne] Failed to retrieve presentation. ID: ${id} was not found in the database.`);
      throw new ApiError(`Presentation with ID ${id} could not be found.`, 404, false);
    }

    if (ownerId && presentation.ownerId && presentation.ownerId !== ownerId) {
      logger.error(`[PresentationService.findOne] Access denied. User ${ownerId} attempted to access presentation ${id} owned by ${presentation.ownerId}`);
      throw new ApiError(`Forbidden. You do not have permission to access this presentation.`, 403, false);
    }

    return presentation;
  }

  /**
   * Full save (upsert) of a presentation — replaces all slides/options.
   * This is the primary "Save" action from the editor toolbar.
   */
  async update(id: string, dto: UpdatePresentationDto, ownerId?: string): Promise<PresentationEntity> {
    const presentation = await this.findOne(id, ownerId);

    const updatedId = await AppDataSource.manager.transaction(async (manager) => {
      // Update scalar fields
      manager.merge(PresentationEntity, presentation, {
        title: dto.title,
        description: dto.description,
        thumbnail: dto.thumbnail,
        status: dto.status,
        theme: dto.theme,
      });
      await manager.save(PresentationEntity, presentation);

      // If slides are provided — replace all slides for this presentation
      if (dto.slides !== undefined) {
        // Delete all existing slides (cascade deletes options)
        await manager
          .createQueryBuilder()
          .delete()
          .from(SlideEntity)
          .where("presentationId = :id", { id })
          .execute();

        // Re-insert from DTO
        for (const slideDto of dto.slides) {
          const { id: slideId, options, meta, ...slideFields } = slideDto;

          const slide = manager.create(SlideEntity, {
            ...slideFields,
            meta: meta ?? {},
            presentationId: id,
          });
          const savedSlide = await manager.save(slide);

          if (options && options.length > 0) {
            const slideOptions = options.map((opt, idx) => {
              const { id: optId, ...optFields } = opt;
              return manager.create(SlideOptionEntity, {
                ...optFields,
                color: opt.color,
                imageUrl: opt.imageUrl,
                votes: opt.votes ?? 0,
                order: idx,
                slideId: savedSlide.id,
              });
            });
            await manager.save(slideOptions);
          }
        }

        logger.info(`Presentation ${id} slides updated (${dto.slides.length} slides)`);
      }

      return id;
    });

    logger.info(`Presentation ${updatedId} successfully updated and committed.`);
    await this.invalidatePresentation(updatedId, ownerId);
    return this.findOne(updatedId);
  }

  /**
   * Applies a theme to the presentation and ALL its slides.
   */
  async updateTheme(id: string, theme: any, ownerId?: string): Promise<PresentationEntity> {
    const presentation = await this.findOne(id, ownerId);

    await AppDataSource.manager.transaction(async (manager) => {
      // 1. Update presentation theme
      manager.merge(PresentationEntity, presentation, { theme });
      await manager.save(PresentationEntity, presentation);

      // 2. Update all slides
      if (presentation.slides && presentation.slides.length > 0) {
        for (const slide of presentation.slides) {
          slide.theme = theme;
          await manager.save(SlideEntity, slide);
        }
      }
    });

    await this.invalidatePresentation(id, ownerId);
    return this.findOne(id);
  }

  /**
   * Reorders slides within a presentation.
   */
  async reorderSlides(id: string, slideIds: string[], ownerId?: string): Promise<PresentationEntity> {
    const presentation = await this.findOne(id, ownerId);

    await AppDataSource.manager.transaction(async (manager) => {
      if (!presentation.slides) return;
      
      const slideMap = new Map();
      presentation.slides.forEach(s => slideMap.set(s.id, s));

      for (let i = 0; i < slideIds.length; i++) {
        const slideId = slideIds[i];
        const slide = slideMap.get(slideId);
        if (slide) {
          slide.order = i;
          await manager.save(SlideEntity, slide);
        }
      }
    });

    await this.invalidatePresentation(id, ownerId);
    return this.findOne(id);
  }

  /**
   * Delete a presentation by ID.
   */
  async remove(id: string, ownerId?: string): Promise<void> {
    await this.findOne(id, ownerId);
    await this.presentationRepo.delete(id);
    logger.info(`Presentation deleted: ${id}`);
    await this.invalidatePresentation(id, ownerId);
  }

  /**
   * Duplicate a presentation — deep copy with new IDs.
   */
  async duplicate(id: string, ownerId?: string): Promise<PresentationEntity> {
    const original = await this.findOne(id, ownerId);

    const dto: CreatePresentationDto = {
      title: `${original.title} (Copy)`,
      description: original.description,
      thumbnail: original.thumbnail,
      status: "draft",
      theme: original.theme,
      isAIGenerated: original.isAIGenerated,
      slides: (original.slides || []).map((slide, idx) => ({
        id: slide.id, // will be ignored — new ID generated by entity
        type: slide.type,
        title: slide.title,
        subtitle: slide.subtitle,
        theme: slide.theme,
        settings: slide.settings,
        order: idx,
        meta: slide.meta,
        options: (slide.options || []).map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          color: opt.color,
          imageUrl: opt.imageUrl,
          votes: 0, // reset votes on duplicate
        })),
      })),
    };

    return this.create(dto, ownerId);
  }

  /**
   * Create a presentation from a template.
   */
  async createFromTemplate(
    templateId: string,
    ownerId?: string
  ): Promise<PresentationEntity> {
    const templateRepo = AppDataSource.getRepository("templates");
    const template: any = await templateRepo.findOne({ where: { id: templateId } });
    
    if (!template) {
      logger.error(`[PresentationService.createFromTemplate] Failed to locate template. Template ID: ${templateId} was not found in the database.`);
      throw new ApiError(`Template with ID ${templateId} could not be found.`, 404, false);
    }

    const dto: CreatePresentationDto = {
      title: template.title,
      description: template.description,
      thumbnail: template.thumbnail,
      status: "draft",
      theme: template.theme || {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        accentColor: "#3b82f6",
        fontFamily: "Inter",
      },
      templateId: template.id,
      isAIGenerated: false,
      slides: template.slides as any || [],
    };

    logger.info(`Extracted ${dto.slides.length} slides from template ${templateId}`);

    return this.create(dto, ownerId);
  }
}
