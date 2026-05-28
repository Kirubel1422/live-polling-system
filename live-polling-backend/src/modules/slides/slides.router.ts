import { Router } from "express";
import { SlideController } from "./slides.controller";
import validate from "src/validators/validate";
import {
  CreateSlideSchema,
  UpdateSlideSchema,
  ReorderSlidesSchema,
} from "src/validators/slide.validator";

/**
 * Slides router — mounted at /api/presentations/:presentationId/slides
 * by the presentations router (mergeParams: true).
 *
 * All routes are scoped to a parent presentation.
 */
const router = Router({ mergeParams: true });
const slideController = new SlideController();

/**
 * POST /api/presentations/:presentationId/slides
 * Create a new slide for the presentation.
 */
router.post("/", validate(CreateSlideSchema), slideController.create);

/**
 * GET /api/presentations/:presentationId/slides
 * List all slides for the presentation, ordered by `order`.
 */
router.get("/", slideController.findAll);

/**
 * PUT /api/presentations/:presentationId/slides/reorder
 * Reorder slides by providing an ordered array of slide IDs.
 * NOTE: must be defined BEFORE /:slideId to avoid route conflict.
 */
router.put("/reorder", validate(ReorderSlidesSchema), slideController.reorder);

/**
 * GET /api/presentations/:presentationId/slides/:slideId
 * Get a single slide with its options.
 */
router.get("/:slideId", slideController.findOne);

/**
 * PATCH /api/presentations/:presentationId/slides/:slideId/settings
 * Update only the settings object of a slide (toggles, sliders, etc.).
 * NOTE: defined before /:slideId to avoid route conflict.
 */
router.patch("/:slideId/settings", slideController.updateSettings);

/**
 * PUT /api/presentations/:presentationId/slides/:slideId
 * Update a slide — content, theme, settings, options, or meta.
 */
router.put("/:slideId", validate(UpdateSlideSchema), slideController.update);

/**
 * DELETE /api/presentations/:presentationId/slides/:slideId
 * Delete a slide and re-normalise remaining slide order.
 */
router.delete("/:slideId", slideController.remove);

/**
 * POST /api/presentations/:presentationId/slides/:slideId/duplicate
 * Deep-duplicate a slide (new ID, reset votes, appended at end).
 */
router.post("/:slideId/duplicate", slideController.duplicate);

export default router;
