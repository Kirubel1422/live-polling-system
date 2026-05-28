import { Request, Response, NextFunction } from "express";
import { PresentationService } from "./presentations.service";
import { ApiResp } from "src/utils/api/api.response";
import logger from "src/utils/logger/logger";
import {
  CreatePresentationDto,
  UpdatePresentationDto,
} from "src/validators/presentation.validator";

export class PresentationController {
  private presentationService: PresentationService;

  constructor() {
    this.presentationService = new PresentationService();

    this.create = this.create.bind(this);
    this.createFromTemplate = this.createFromTemplate.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.updateTheme = this.updateTheme.bind(this);
    this.reorderSlides = this.reorderSlides.bind(this);
    this.generate = this.generate.bind(this);
  }

  /** POST /api/presentations */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreatePresentationDto;
      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.create(dto, ownerId);
      logger.info(`Presentation created: ${presentation.id}`);
      res
        .status(201)
        .json(new ApiResp("Presentation created successfully.", 201, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/presentations/template/:templateId */
  async createFromTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req.user as any)?.id;
      const templateId = req.params["templateId"] as string;

      const presentation = await this.presentationService.createFromTemplate(templateId, ownerId);
      logger.info(`Presentation created from template: ${presentation.id}`);
      res.status(201).json(new ApiResp("Presentation created from template successfully.", 201, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/presentations */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req.user as any)?.id;
      const presentations = await this.presentationService.findAll(ownerId);
      res
        .status(200)
        .json(new ApiResp("Presentations fetched successfully.", 200, true, presentations));
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/presentations/:id */
  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.findOne(req.params["id"] as string, ownerId);
      res
        .status(200)
        .json(new ApiResp("Presentation fetched successfully.", 200, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/presentations/:id — Full save from editor toolbar */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdatePresentationDto;
      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.update(
        req.params["id"] as string,
        dto,
        ownerId
      );
      logger.info(`Presentation saved: ${req.params.id}`);
      res
        .status(200)
        .json(new ApiResp("Presentation saved successfully.", 200, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/presentations/:id */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req.user as any)?.id;
      await this.presentationService.remove(req.params["id"] as string, ownerId);
      logger.info(`Presentation deleted: ${req.params.id}`);
      res
        .status(200)
        .json(new ApiResp("Presentation deleted successfully.", 200, true));
    } catch (error) {
      next(error);
    }
  }

  /** PATCH /api/presentations/:id/theme */
  async updateTheme(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const theme = req.body;
      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.updateTheme(
        req.params["id"] as string,
        theme,
        ownerId
      );
      logger.info(`Presentation theme updated: ${req.params.id}`);
      res
        .status(200)
        .json(new ApiResp("Presentation theme updated successfully.", 200, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** PATCH /api/presentations/:id/reorder */
  async reorderSlides(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slideIds } = req.body as { slideIds: string[] };
      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.reorderSlides(
        req.params["id"] as string,
        slideIds,
        ownerId
      );
      logger.info(`Presentation slides reordered: ${req.params.id}`);
      res
        .status(200)
        .json(new ApiResp("Presentation slides reordered successfully.", 200, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/presentations/:id/duplicate */
  async duplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.duplicate(
        req.params["id"] as string,
        ownerId
      );
      res
        .status(201)
        .json(new ApiResp("Presentation duplicated successfully.", 201, true, presentation));
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/presentations/generate */
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json(new ApiResp("Prompt is required.", 400, false));
        return;
      }
      
      const { AIGeneratorService } = await import("src/ai/ai-generator.service");
      const aiService = new AIGeneratorService();
      const generatedData = await aiService.generatePresentation(prompt);

      // Format the AI's output into a CreatePresentationDto
      const crypto = require('crypto');
      const dto: CreatePresentationDto = {
        title: generatedData.presentation.title || "AI Generated Presentation",
        description: generatedData.presentation.description,
        isAIGenerated: true,
        status: "draft",
        theme: generatedData.presentation.theme || {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          accentColor: "#0000ff"
        },
        slides: (generatedData.slides || []).map((slide: any, index: number) => ({
          ...slide,
          id: crypto.randomUUID(),
          order: index,
          options: (slide.options || []).map((opt: any) => ({
            ...opt,
            id: crypto.randomUUID()
          }))
        }))
      };

      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.create(dto, ownerId);

      res.status(201).json(new ApiResp("Presentation generated successfully.", 201, true, presentation));
    } catch (error) {
      next(error);
    }
  }
}
