import { Router } from "express";
import { ParticipantController } from "./participant.controller";

const router = Router();
const controller = new ParticipantController();

router.post("/join", controller.joinSession);
router.get("/session/:presentationId", controller.getSessionData);
router.post("/response", controller.submitResponse);

export default router;
