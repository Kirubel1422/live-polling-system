import { Request, Response, NextFunction } from "express";
import { ParticipantService } from "./participant.service";
import { ApiResp } from "src/utils/api/api.response";

export class ParticipantController {
  private service = new ParticipantService();

  joinSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { joinCode, name } = req.body;
      const result = await this.service.joinSession(joinCode, name, req.cookies);
      res.status(200).json(new ApiResp("Joined successfully", 200, true, result));
    } catch (error) {
      next(error);
    }
  };

  getSessionData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const presentationId = req.params.presentationId as string;
      const result = await this.service.getSessionData(presentationId);
      res.status(200).json(new ApiResp("Session data fetched successfully", 200, true, result));
    } catch (error) {
      next(error);
    }
  };

  submitResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { participantId, slideId, value } = req.body;
      const result = await this.service.submitResponse(participantId, slideId, value);
      res.status(200).json(new ApiResp("Response submitted successfully", 200, true, result));
    } catch (error) {
      next(error);
    }
  };

  upvoteResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { participantId, responseId } = req.body;
      const result = await this.service.upvoteResponse(participantId, responseId);
      res.status(200).json(new ApiResp("Response upvoted successfully", 200, true, result));
    } catch (error) {
      next(error);
    }
  };

  kickParticipant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const participantId = req.params.participantId as string;
      await this.service.kickParticipant(participantId);
      res.status(200).json(new ApiResp("Participant kicked successfully", 200, true));
    } catch (error) {
      next(error);
    }
  };
}
