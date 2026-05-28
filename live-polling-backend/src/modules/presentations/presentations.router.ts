import { Router } from "express";
import { PresentationController } from "./presentations.controller";
import validate from "src/validators/validate";
import {
  CreatePresentationSchema,
  UpdatePresentationSchema,
} from "src/validators/presentation.validator";
import slideRoutes from "src/modules/slides/slides.router";
import passport from "passport";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
const presentationController = new PresentationController();

/**
 * POST /api/presentations
 * Create a new presentation (with slides).
 */
router.post(
  "/",
  validate(CreatePresentationSchema),
  presentationController.create
);

/**
 * POST /api/presentations/template/:templateId
 * Create a presentation from a template.
 */
router.post("/template/:templateId", presentationController.createFromTemplate);

/**
 * GET /api/presentations
 * List all presentations (filtered by owner once auth is added).
 */
router.get("/", presentationController.findAll);

/**
 * POST /api/presentations/generate
 * Generate a presentation using AI.
 */
router.post("/generate", presentationController.generate);

/**
 * GET /api/presentations/:id
 * Fetch one presentation with all its slides and options.
 */
router.get("/:id", presentationController.findOne);

/**
 * PUT /api/presentations/:id
 * Save / update a presentation from the editor.
 * Replaces the full slide set in a transaction.
 */
router.put(
  "/:id",
  validate(UpdatePresentationSchema),
  presentationController.update
);

/**
 * DELETE /api/presentations/:id
 * Delete a presentation and all its slides.
 */
router.delete("/:id", presentationController.remove);

/**
 * POST /api/presentations/:id/duplicate
 * Deep-duplicate a presentation with new IDs.
 */
router.post("/:id/duplicate", presentationController.duplicate);

/**
 * PATCH /api/presentations/:id/theme
 * Apply a theme to the presentation and ALL its slides.
router.patch("/:id/theme", presentationController.updateTheme);

/**
 * PATCH /api/presentations/:id/reorder
 * Reorder slides within a presentation.
 */
router.patch("/:id/reorder", presentationController.reorderSlides);

/**
 * /api/presentations/:id/slides — nested slides module
 * Uses mergeParams so :id (presentationId) is available in the slide routes.
 */
router.use("/:id/slides", slideRoutes);

export default router;

