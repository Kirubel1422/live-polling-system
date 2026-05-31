import { Request, Response, NextFunction } from "express";
import { ParticipantService } from "./participant.service";
import { ApiResp } from "src/utils/api/api.response";

export class ParticipantController {
  private service = new ParticipantService();

  joinSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { joinCode, name } = req.body;
      const result = await this.service.joinSession(joinCode, name);
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
}
