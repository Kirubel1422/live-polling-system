import { Router } from "express";
import presentationRoutes from "./presentations/presentations.router";
import templatesRouter from "./templates/templates.router";
import authRoutes from "./auth/auth.router";
import userRouter from "./user/user.router";
import participantRouter from "./participant/participant.router";
import healthRouter from "./health/health.router";
import metricsRouter from "./metrics/metrics.router";

const router = Router();

router.use("/presentations", presentationRoutes);
router.use("/templates", templatesRouter);

router.use("/auth", authRoutes);
router.use("/user", userRouter);
router.use("/participant", participantRouter);
router.use("/health", healthRouter);
router.use("/metrics", metricsRouter);

export default router;
