import { Router } from "express";
import { HealthController } from "./health.controller";

const router = Router();

router.get("/live", HealthController.live);
router.get("/ready", HealthController.ready);
router.get("/", HealthController.combined);

export default router;
