import { AppDataSource } from "src/configs/database";
import { LiveSessionEntity } from "src/entities/LiveSession.entity";
import { ParticipantEntity } from "src/entities/Participant.entity";
import { ParticipantResponseEntity } from "src/entities/ParticipantResponse.entity";
import { PresentationEntity } from "src/entities/Presentation.entity";
import { SlideEntity } from "src/entities/Slide.entity";
import { ApiError } from "src/utils/api/api.response";
import { getSocketIO } from "src/utils/socket";
import { CacheService } from "src/utils/cache/cache.service";
import { CacheKeys } from "src/utils/cache/cache.keys";
import {
  participantJoinTotal,
  participantResponseTotal,
  participantUpvoteTotal,
} from "src/observability/metrics";

export class ParticipantService {
  private liveSessionRepo = AppDataSource.getRepository(LiveSessionEntity);
  private participantRepo = AppDataSource.getRepository(ParticipantEntity);
  private responseRepo = AppDataSource.getRepository(ParticipantResponseEntity);
  private presentationRepo = AppDataSource.getRepository(PresentationEntity);
  private slideRepo = AppDataSource.getRepository(SlideEntity);

  async joinSession(joinCode: string, name: string, cookies?: any) {
    const presentation = await this.presentationRepo.findOne({
      where: { joinCode },
    });

    if (!presentation) {
      throw new ApiError("Invalid join code", 404);
    }

    if (cookies && cookies[`blocked_${presentation.id}`]) {
      throw new ApiError("You have been permanently blocked from this presentation.", 403);
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

    participantJoinTotal.inc();
    await CacheService.deleteKey(CacheKeys.sessionData(session.presentationId));

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
      relations: ["slides", "slides.options", "slides.responses"],
    });

    if (!presentation) {
      throw new ApiError("Presentation not found", 404);
    }
    
    presentation.slides.sort((a, b) => a.order - b.order);

    const participants = await this.participantRepo.find({
      where: { sessionId: session.id },
      order: { joinedAt: "ASC" }
    });

    return {
      session,
      presentation,
      participants,
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

    const slide = await this.slideRepo.findOne({ where: { id: slideId } });
    if (!slide) {
      throw new ApiError("Slide not found", 404);
    }

    const existingResponse = await this.responseRepo.findOne({
      where: { participantId, slideId },
    });

    if (existingResponse) {
      throw new ApiError("You have already responded to this slide", 400);
    }

    let formattedValue = value;
    if (slide.type === "qa") {
      formattedValue = {
        text: typeof value === 'string' ? value : (value?.text || ""),
        upvotes: 0,
        upvotedBy: []
      };
    }

    const response = this.responseRepo.create({
      value: formattedValue,
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

    participantResponseTotal.inc();
    await CacheService.deleteKey(CacheKeys.sessionData(participant.session.presentationId));

    return response;
  }

  async upvoteResponse(participantId: string, responseId: string) {
    const participant = await this.participantRepo.findOne({
      where: { id: participantId },
      relations: ["session"],
    });

    if (!participant) {
      throw new ApiError("Participant not found", 404);
    }

    const response = await this.responseRepo.findOne({
      where: { id: responseId }
    });

    if (!response) {
      throw new ApiError("Question response not found", 404);
    }

    let val: any = response.value;
    if (typeof val === 'string') {
      val = { text: val, upvotes: 0, upvotedBy: [] };
    } else if (typeof val === 'object' && val !== null) {
      if (!val.text) {
        val.text = val.value || "";
      }
      if (typeof val.upvotes !== 'number') {
        val.upvotes = 0;
      }
      if (!Array.isArray(val.upvotedBy)) {
        val.upvotedBy = [];
      }
    } else {
      val = { text: String(val), upvotes: 0, upvotedBy: [] };
    }

    if (val.upvotedBy.includes(participantId)) {
      throw new ApiError("You have already upvoted this question", 400);
    }

    val.upvotedBy.push(participantId);
    val.upvotes = (val.upvotes || 0) + 1;

    response.value = val;
    await this.responseRepo.save(response);

    getSocketIO().to(`presentation:${participant.session.presentationId}`).emit("participant-response-updated", {
      slideId: response.slideId,
      response
    });

    participantUpvoteTotal.inc();

    return response;
  }

  async kickParticipant(participantId: string) {
    const participant = await this.participantRepo.findOne({
      where: { id: participantId },
      relations: ["session"]
    });

    if (!participant) {
      throw new ApiError("Participant not found", 404);
    }

    const presentationId = participant.session.presentationId;

    await this.participantRepo.remove(participant);

    const randomValue = Math.random().toString(36).substring(2);

    getSocketIO().to(`presentation:${presentationId}`).emit("participant-kicked", {
      participantId,
      cookieKey: `blocked_${presentationId}`,
      cookieValue: randomValue
    });
    
    return presentationId;
  }
}
