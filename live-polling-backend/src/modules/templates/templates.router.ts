import { Router } from "express";
import { TemplateController } from "./templates.controller";
import validate from "src/validators/validate";
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
} from "src/validators/template.validator";

const router = Router();
const templateController = new TemplateController();

/**
 * POST /api/templates
 */
router.post(
  "/",
  validate(CreateTemplateSchema),
  templateController.create
);

/**
 * GET /api/templates
 */
router.get("/", templateController.findAll);

/**
 * GET /api/templates/:id
 */
router.get("/:id", templateController.findOne);

/**
 * PUT /api/templates/:id
 */
router.put(
  "/:id",
  validate(UpdateTemplateSchema),
  templateController.update
);

/**
 * DELETE /api/templates/:id
 */
router.delete("/:id", templateController.remove);

export default router;
