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
    this.enhance = this.enhance.bind(this);
    this.contextInterview = this.contextInterview.bind(this);
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

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = aiService.generatePresentationStream(prompt);
      let generatedData: any = null;

      for await (const chunk of stream) {
        if (chunk.type === "reasoning") {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        } else if (chunk.type === "result") {
          generatedData = chunk.data;
        }
      }

      if (!generatedData) {
        throw new Error("No presentation data returned");
      }

      // Format the AI's output into a CreatePresentationDto
      const crypto = require('crypto');
      const dto: CreatePresentationDto = {
        title: generatedData.presentation?.title || "AI Generated Presentation",
        description: generatedData.presentation?.description,
        isAIGenerated: true,
        status: "draft",
        theme: generatedData.presentation?.theme || {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          accentColor: "#0000ff"
        },
        slides: (generatedData.slides || []).map((slide: any, index: number) => {
          const coreFields = ['id', 'type', 'title', 'subtitle', 'theme', 'settings', 'options', 'items'];
          const meta: any = {};
          const mappedSlide: any = {};
          
          Object.entries(slide).forEach(([key, value]) => {
            if (coreFields.includes(key)) {
              mappedSlide[key] = value;
            } else if (key === 'meta' && typeof value === 'object' && value !== null) {
              Object.assign(meta, value);
            } else {
              meta[key] = value;
            }
          });

          return {
            ...mappedSlide,
            meta,
            id: crypto.randomUUID(),
            order: index,
            options: (slide.options || slide.items || []).map((opt: any) => ({
              ...opt,
              id: crypto.randomUUID()
            }))
          };
        })
      };

      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.create(dto, ownerId);

      res.write(`data: ${JSON.stringify({ type: "presentation", data: presentation })}\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) {
        res.status(500).json(new ApiResp(error.message, 500, false));
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
        res.end();
      }
    }
  }

  /** POST /api/presentations/:id/enhance */
  async enhance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, presentationData } = req.body;
      if (!prompt || !presentationData) {
        res.status(400).json(new ApiResp("Prompt and presentationData are required.", 400, false));
        return;
      }
      
      const { AIGeneratorService } = await import("src/ai/ai-generator.service");
      const aiService = new AIGeneratorService();

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = aiService.enhancePresentationStream(prompt, presentationData);
      let generatedData: any = null;

      for await (const chunk of stream) {
        if (chunk.type === "reasoning") {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        } else if (chunk.type === "result") {
          generatedData = chunk.data;
        }
      }

      if (!generatedData) {
        throw new Error("No presentation data returned");
      }

      // Format the AI's output into an UpdatePresentationDto
      const dto: UpdatePresentationDto = {
        title: generatedData.presentation?.title,
        description: generatedData.presentation?.description,
        theme: generatedData.presentation?.theme,
        slides: (generatedData.slides || []).map((slide: any, index: number) => {
          const coreFields = ['id', 'type', 'title', 'subtitle', 'theme', 'settings', 'options', 'items'];
          const meta: any = {};
          const mappedSlide: any = {};
          
          const originalSlide = presentationData.slides?.find((s: any) => s.id === slide.id);
          const defaultTheme = originalSlide?.theme || presentationData.theme || {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            accentColor: "#0000ff"
          };
          
          Object.entries(slide).forEach(([key, value]) => {
            if (coreFields.includes(key)) {
              mappedSlide[key] = value;
            } else if (key === 'meta' && typeof value === 'object' && value !== null) {
              Object.assign(meta, value);
            } else {
              meta[key] = value;
            }
          });

          return {
            ...mappedSlide,
            theme: mappedSlide.theme || defaultTheme,
            meta: { ...originalSlide?.meta, ...meta },
            id: slide.id,
            order: index,
            options: (slide.options || slide.items || []).map((opt: any) => ({
              ...opt,
              id: opt.id
            }))
          };
        })
      };

      const ownerId = (req.user as any)?.id;
      const presentation = await this.presentationService.update(
        req.params["id"] as string,
        dto,
        ownerId
      );

      res.write(`data: ${JSON.stringify({ type: "presentation", data: presentation })}\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) {
        res.status(500).json(new ApiResp(error.message, 500, false));
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
        res.end();
      }
    }
  }

  /** POST /api/presentations/context-interview */
  async contextInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json(new ApiResp("Messages array is required.", 400, false));
        return;
      }

      const { AIGeneratorService } = await import("src/ai/ai-generator.service");
      const aiService = new AIGeneratorService();

      const result = await aiService.contextBuilderChat(messages);
      res.status(200).json(new ApiResp("Context interview response.", 200, true, result));
    } catch (error: any) {
      res.status(500).json(new ApiResp(error.message, 500, false));
    }
  }
}
