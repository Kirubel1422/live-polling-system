import { Router } from "express";
import presentationRoutes from "./presentations/presentations.router";
import templateRoutes from "./templates/templates.router";
import authRoutes from "./auth/auth.router";

const router = Router();

router.use("/presentations", presentationRoutes);
router.use("/templates", templateRoutes);

router.use("/auth", authRoutes);
// router.use("/sessions", sessionRoutes);
// router.use("/sessions", sessionRoutes);
// router.use("/templates", templateRoutes);

export default router;
