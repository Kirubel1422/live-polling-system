import { Request, Response, NextFunction } from "express";
import { TemplateService } from "./templates.service";
import { ApiResp } from "src/utils/api/api.response";
import logger from "src/utils/logger/logger";
import {
  CreateTemplateDto,
  UpdateTemplateDto,
} from "src/validators/template.validator";

export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /** POST /api/templates */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateTemplateDto;
      const template = await this.templateService.create(dto);
      logger.info(`Template created: ${template.id}`);
      res
        .status(201)
        .json(new ApiResp("Template created successfully.", 201, true, template));
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/templates */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // By default fetch only public, but if user is admin we could pass false
      const templates = await this.templateService.findAll(true);
      res
        .status(200)
        .json(new ApiResp("Templates fetched successfully.", 200, true, templates));
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/templates/:id */
  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const template = await this.templateService.findOne(req.params["id"] as string);
      res
        .status(200)
        .json(new ApiResp("Template fetched successfully.", 200, true, template));
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/templates/:id */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateTemplateDto;
      const template = await this.templateService.update(req.params["id"] as string, dto);
      logger.info(`Template updated: ${template.id}`);
      res
        .status(200)
        .json(new ApiResp("Template updated successfully.", 200, true, template));
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/templates/:id */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.templateService.remove(req.params["id"] as string);
      res
        .status(200)
        .json(new ApiResp("Template deleted successfully.", 200, true));
    } catch (error) {
      next(error);
    }
  }
}
