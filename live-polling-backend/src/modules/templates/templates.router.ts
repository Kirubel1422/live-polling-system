import { Router } from "express";
import { TemplateController } from "./templates.controller";
import validate from "src/validators/validate";
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
} from "src/validators/template.validator";
import { templateMutationLimiter } from "src/utils/rate-limit/rate-limiters";

const router = Router();
const templateController = new TemplateController();

/**
 * GET /api/templates — public, no heavy rate limit (uses cache)
 */
router.get("/", templateController.findAll);

/**
 * GET /api/templates/:id — public, no heavy rate limit (uses cache)
 */
router.get("/:id", templateController.findOne);

/**
 * POST /api/templates — mutation, rate limited
 */
router.post(
  "/",
  templateMutationLimiter,
  validate(CreateTemplateSchema),
  templateController.create
);

/**
 * PUT /api/templates/:id — mutation, rate limited
 */
router.put(
  "/:id",
  templateMutationLimiter,
  validate(UpdateTemplateSchema),
  templateController.update
);

/**
 * DELETE /api/templates/:id — mutation, rate limited
 */
router.delete("/:id", templateMutationLimiter, templateController.remove);

export default router;
