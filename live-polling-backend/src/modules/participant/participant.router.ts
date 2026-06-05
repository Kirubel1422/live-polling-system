import { Router } from "express";
import { ParticipantController } from "./participant.controller";
import validate from "src/validators/validate";
import {
  JoinSessionSchema,
  GetSessionDataSchema,
  SubmitResponseSchema,
  UpvoteResponseSchema,
  KickParticipantSchema,
} from "src/validators/participant.validator";
import {
  participantJoinLimiter,
  participantResponseLimiter,
  generalApiLimiter,
} from "src/utils/rate-limit/rate-limiters";

const router = Router();
const controller = new ParticipantController();

router.post("/join", participantJoinLimiter, validate(JoinSessionSchema), controller.joinSession);
router.get("/session/:presentationId", generalApiLimiter, validate(GetSessionDataSchema), controller.getSessionData);
router.post("/response", participantResponseLimiter, validate(SubmitResponseSchema), controller.submitResponse);
router.post("/upvote", participantResponseLimiter, validate(UpvoteResponseSchema), controller.upvoteResponse);
router.delete("/:participantId", generalApiLimiter, validate(KickParticipantSchema), controller.kickParticipant);

export default router;
