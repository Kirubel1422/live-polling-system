import { AppDataSource } from "src/configs/database";
import { TemplateEntity } from "src/entities/Template.entity";
import { ApiError } from "src/utils/api/api.response";
import logger from "src/utils/logger/logger";
import {
  CreateTemplateDto,
  UpdateTemplateDto,
} from "src/validators/template.validator";

export class TemplateService {
  private templateRepo = AppDataSource.getRepository(TemplateEntity);

  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Create a new template
   */
  async create(dto: CreateTemplateDto): Promise<TemplateEntity> {
    const template = this.templateRepo.create(dto);
    const saved = await this.templateRepo.save(template);
    logger.info(`Template created: ${saved.id}`);
    return saved;
  }

  /**
   * Fetch all public templates (or all if admin)
   */
  async findAll(onlyPublic: boolean = true): Promise<TemplateEntity[]> {
    const query = this.templateRepo.createQueryBuilder("template");
    
    if (onlyPublic) {
      query.where("template.isPublic = :isPublic", { isPublic: true });
    }

    query.orderBy("template.createdAt", "DESC");
    return query.getMany();
  }

  /**
   * Fetch a single template by ID
   */
  async findOne(id: string): Promise<TemplateEntity> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) {
      throw new ApiError("Template not found", 404, false);
    }
    return template;
  }

  /**
   * Update a template
   */
  async update(id: string, dto: UpdateTemplateDto): Promise<TemplateEntity> {
    const template = await this.findOne(id);
    
    this.templateRepo.merge(template, dto);
    const saved = await this.templateRepo.save(template);
    
    logger.info(`Template updated: ${saved.id}`);
    return saved;
  }

  /**
   * Delete a template
   */
  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    await this.templateRepo.remove(template);
    logger.info(`Template deleted: ${id}`);
  }
}
