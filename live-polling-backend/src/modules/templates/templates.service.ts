import { AppDataSource } from "src/configs/database";
import { TemplateEntity } from "src/entities/Template.entity";
import { ApiError } from "src/utils/api/api.response";
import logger from "src/utils/logger/logger";
import {
  CreateTemplateDto,
  UpdateTemplateDto,
} from "src/validators/template.validator";
import { CacheService } from "src/utils/cache/cache.service";
import { CacheKeys } from "src/utils/cache/cache.keys";

const TEMPLATE_CACHE_TTL = 300; // 5 minutes

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

    // Invalidate list cache
    await CacheService.deleteKey(CacheKeys.templatesList());
    return saved;
  }

  /**
   * Fetch all public templates (or all if admin)
   */
  async findAll(onlyPublic: boolean = true): Promise<TemplateEntity[]> {
    if (onlyPublic) {
      return CacheService.remember(
        CacheKeys.templatesList(),
        TEMPLATE_CACHE_TTL,
        async () => {
          const query = this.templateRepo.createQueryBuilder("template");
          query.where("template.isPublic = :isPublic", { isPublic: true });
          query.orderBy("template.createdAt", "DESC");
          return query.getMany();
        }
      );
    }

    const query = this.templateRepo.createQueryBuilder("template");
    query.orderBy("template.createdAt", "DESC");
    return query.getMany();
  }

  /**
   * Fetch a single template by ID
   */
  async findOne(id: string): Promise<TemplateEntity> {
    return CacheService.remember(
      CacheKeys.templateById(id),
      TEMPLATE_CACHE_TTL,
      async () => {
        const template = await this.templateRepo.findOne({ where: { id } });
        if (!template) {
          throw new ApiError("Template not found", 404, false);
        }
        return template;
      }
    );
  }

  /**
   * Update a template
   */
  async update(id: string, dto: UpdateTemplateDto): Promise<TemplateEntity> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) {
      throw new ApiError("Template not found", 404, false);
    }
    
    this.templateRepo.merge(template, dto);
    const saved = await this.templateRepo.save(template);
    
    logger.info(`Template updated: ${saved.id}`);

    // Invalidate caches
    await CacheService.deleteKey(CacheKeys.templatesList());
    await CacheService.deleteKey(CacheKeys.templateById(id));
    return saved;
  }

  /**
   * Delete a template
   */
  async remove(id: string): Promise<void> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) {
      throw new ApiError("Template not found", 404, false);
    }
    await this.templateRepo.remove(template);
    logger.info(`Template deleted: ${id}`);

    // Invalidate caches
    await CacheService.deleteKey(CacheKeys.templatesList());
    await CacheService.deleteKey(CacheKeys.templateById(id));
  }
}
