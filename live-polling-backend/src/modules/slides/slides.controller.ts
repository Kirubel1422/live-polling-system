import { Request, Response, NextFunction } from "express";
import { SlideService } from "./slides.service";
import { ApiResp } from "src/utils/api/api.response";
import logger from "src/utils/logger/logger";
import {
  CreateSlideDto,
  UpdateSlideDto,
  ReorderSlidesDto,
} from "src/validators/slide.validator";

export class SlideController {
  private slideService: SlideService;

  constructor() {
    this.slideService = new SlideService();

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.reorder = this.reorder.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  /** POST /api/presentations/:id/slides */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const dto = req.body as CreateSlideDto;
      const ownerId = (req.user as any)?.id;
      const slide = await this.slideService.create(presentationId, dto, ownerId);
      logger.info(`Slide created: ${slide.id}`);
      res.status(201).json(new ApiResp("Slide created successfully.", 201, true, slide));
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/presentations/:id/slides */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const ownerId = (req.user as any)?.id;
      const slides = await this.slideService.findAllByPresentation(presentationId, ownerId);
      res.status(200).json(new ApiResp("Slides fetched successfully.", 200, true, slides));
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/presentations/:id/slides/:slideId */
  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const slideId = req.params["slideId"] as string;
      const ownerId = (req.user as any)?.id;
      const slide = await this.slideService.findOne(slideId, presentationId, ownerId);
      res.status(200).json(new ApiResp("Slide fetched successfully.", 200, true, slide));
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/presentations/:id/slides/:slideId */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const slideId = req.params["slideId"] as string;
      const dto = req.body as UpdateSlideDto;
      const ownerId = (req.user as any)?.id;
      const slide = await this.slideService.update(slideId, presentationId, dto, ownerId);
      logger.info(`Slide updated: ${slideId}`);
      res.status(200).json(new ApiResp("Slide updated successfully.", 200, true, slide));
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/presentations/:id/slides/:slideId */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const slideId = req.params["slideId"] as string;
      const ownerId = (req.user as any)?.id;
      await this.slideService.remove(slideId, presentationId, ownerId);
      res.status(200).json(new ApiResp("Slide deleted successfully.", 200, true));
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/presentations/:id/slides/reorder */
  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const dto = req.body as ReorderSlidesDto;
      const ownerId = (req.user as any)?.id;
      const slides = await this.slideService.reorder(presentationId, dto, ownerId);
      res.status(200).json(new ApiResp("Slides reordered successfully.", 200, true, slides));
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/presentations/:id/slides/:slideId/duplicate */
  async duplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const slideId = req.params["slideId"] as string;
      const ownerId = (req.user as any)?.id;
      const slide = await this.slideService.duplicate(slideId, presentationId, ownerId);
      res.status(201).json(new ApiResp("Slide duplicated successfully.", 201, true, slide));
    } catch (error) {
      next(error);
    }
  }

  /** PATCH /api/presentations/:id/slides/:slideId/settings */
  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const presentationId = req.params["id"] as string;
      const slideId = req.params["slideId"] as string;
      const settings = req.body;
      const ownerId = (req.user as any)?.id;
      const slide = await this.slideService.updateSettings(slideId, presentationId, settings, ownerId);
      res.status(200).json(new ApiResp("Slide settings updated successfully.", 200, true, slide));
    } catch (error) {
      next(error);
    }
  }
}
