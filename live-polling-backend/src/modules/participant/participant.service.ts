import { AppDataSource } from "src/configs/database";
import { LiveSessionEntity } from "src/entities/LiveSession.entity";
import { ParticipantEntity } from "src/entities/Participant.entity";
import { ParticipantResponseEntity } from "src/entities/ParticipantResponse.entity";
import { PresentationEntity } from "src/entities/Presentation.entity";
import { ApiError } from "src/utils/api/api.response";
import { getSocketIO } from "src/utils/socket";

export class ParticipantService {
  private liveSessionRepo = AppDataSource.getRepository(LiveSessionEntity);
  private participantRepo = AppDataSource.getRepository(ParticipantEntity);
  private responseRepo = AppDataSource.getRepository(ParticipantResponseEntity);
  private presentationRepo = AppDataSource.getRepository(PresentationEntity);

  async joinSession(joinCode: string, name: string) {
    const presentation = await this.presentationRepo.findOne({
      where: { joinCode },
    });

    if (!presentation) {
      throw new ApiError("Invalid join code", 404);
    }
    
    // Find or create an active live session for this presentation
    let session = await this.liveSessionRepo.findOne({
      where: { presentationId: presentation.id, isLive: true },
      order: { createdAt: "DESC" }
    });

    if (!session) {
      session = this.liveSessionRepo.create({
        presentationId: presentation.id,
        joinCode: presentation.joinCode || "",
        isLive: true,
        currentSlideIndex: 0,
        startedAt: new Date()
      });
      await this.liveSessionRepo.save(session);
    }

    const participant = this.participantRepo.create({
      name,
      session,
      sessionId: session.id
    });

    await this.participantRepo.save(participant);

    getSocketIO().to(`presentation:${session.presentationId}`).emit("participant-joined", participant);

    return {
      participantId: participant.id,
      presentationId: session.presentationId,
    };
  }

  async getSessionData(presentationId: string) {
    let session = await this.liveSessionRepo.findOne({
      where: { presentationId, isLive: true },
      order: { createdAt: "DESC" }
    });
    
    if (!session) {
      const presentation = await this.presentationRepo.findOne({ where: { id: presentationId } });
      if (!presentation) throw new ApiError("Presentation not found", 404);

      session = this.liveSessionRepo.create({
        presentationId: presentation.id,
        joinCode: presentation.joinCode || "",
        isLive: true,
        currentSlideIndex: 0,
        startedAt: new Date()
      });
      await this.liveSessionRepo.save(session);
    }

    const presentation = await this.presentationRepo.findOne({
      where: { id: presentationId },
      relations: ["slides", "slides.options"],
    });

    if (!presentation) {
      throw new ApiError("Presentation not found", 404);
    }
    
    presentation.slides.sort((a, b) => a.order - b.order);

    return {
      session,
      presentation,
    };
  }

  async submitResponse(participantId: string, slideId: string, value: any) {
    const participant = await this.participantRepo.findOne({
      where: { id: participantId },
      relations: ["session"],
    });

    if (!participant) {
      throw new ApiError("Participant not found", 404);
    }

    const existingResponse = await this.responseRepo.findOne({
      where: { participantId, slideId },
    });

    if (existingResponse) {
      throw new ApiError("You have already responded to this slide", 400);
    }

    const response = this.responseRepo.create({
      value,
      slideId,
      sessionId: participant.session.id,
      participantId: participant.id,
      participantName: participant.name,
    });

    await this.responseRepo.save(response);

    getSocketIO().to(`presentation:${participant.session.presentationId}`).emit("participant-response", {
      slideId,
      response
    });

    return response;
  }
}
