import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { AppDataSource } from "src/configs/database";
import { LiveSessionEntity } from "src/entities/LiveSession.entity";
import { ParticipantResponseEntity } from "src/entities/ParticipantResponse.entity";
import { ParticipantEntity } from "src/entities/Participant.entity";
import { createRedisDuplicate } from "src/configs/redis";
import { ENV } from "src/constants/dotenv";
import { socketCorsOptions } from "src/configs/cors";
import { SocketSchemas } from "src/validators/socket.validator";
import { checkSocketRateLimit, cleanupSocketBuckets } from "src/utils/rate-limit/socket-rate-limit";
import {
  activeSocketConnections,
  socketEventsTotal,
} from "src/observability/metrics";
import logger from "src/utils/logger/logger";

let io: SocketIOServer;

export async function initializeSocket(server: Server) {
  io = new SocketIOServer(server, {
    cors: socketCorsOptions,
  });

  // ── Attach Redis adapter if enabled ───────────────────────────────────────
  if (ENV.SOCKET_REDIS_ADAPTER_ENABLED) {
    const pubClient = createRedisDuplicate();
    const subClient = createRedisDuplicate();

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      logger.info("[Socket.IO] Redis adapter attached for horizontal scaling.");
    } catch (err) {
      logger.error(`[Socket.IO] Failed to attach Redis adapter: ${err}`);
    }
  }

  io.on("connection", (socket) => {
    activeSocketConnections.inc();
    logger.debug(`[Socket.IO] New client connected: ${socket.id}`);

    // ── join-presentation ─────────────────────────────────────────────────
    socket.on("join-presentation", async (presentationId: string) => {
      if (!checkSocketRateLimit(socket, "join-presentation", 10, 60_000)) return;
      socketEventsTotal.inc({ event: "join-presentation" });

      const parsed = SocketSchemas.joinPresentation.safeParse(presentationId);
      if (!parsed.success) {
        logger.warn(`[Socket.IO] Invalid join-presentation payload from ${socket.id}`);
        return;
      }

      logger.debug(`[Socket.IO] Socket ${socket.id} joined presentation: ${parsed.data}`);
      socket.join(`presentation:${parsed.data}`);

      // Fetch and send existing responses for this presentation's active session
      try {
        const liveSessionRepo = AppDataSource.getRepository(LiveSessionEntity);
        const session = await liveSessionRepo.findOne({
          where: { presentationId: parsed.data, isLive: true },
          order: { createdAt: "DESC" }
        });
        if (session) {
          const responseRepo = AppDataSource.getRepository(ParticipantResponseEntity);
          const responses = await responseRepo.find({
            where: { sessionId: session.id }
          });
          
          const participantRepo = AppDataSource.getRepository(ParticipantEntity);
          const participants = await participantRepo.find({
            where: { sessionId: session.id },
            order: { joinedAt: "ASC" }
          });
          
          logger.debug(`[Socket.IO] Sending ${responses.length} existing responses and ${participants.length} participants to socket ${socket.id}`);
          socket.emit("existing-responses", responses);
          socket.emit("existing-participants", participants);
        }
      } catch (err) {
        logger.error(`[Socket.IO] Failed to fetch existing responses or participants on join: ${err}`);
      }
    });

    // ── presenter-slide-changed ───────────────────────────────────────────
    socket.on("presenter-slide-changed", async (data: { presentationId: string, slideIndex: number }) => {
      if (!checkSocketRateLimit(socket, "presenter-slide-changed", 60, 60_000)) return;
      socketEventsTotal.inc({ event: "presenter-slide-changed" });

      const parsed = SocketSchemas.presenterSlideChanged.safeParse(data);
      if (!parsed.success) {
        logger.warn(`[Socket.IO] Invalid presenter-slide-changed payload from ${socket.id}`);
        return;
      }

      logger.debug(`[Socket.IO] Presenter ${socket.id} changed slide to ${parsed.data.slideIndex} for presentation ${parsed.data.presentationId}`);
      
      // Update the active session in the database so late joiners get the right slide
      try {
        const liveSessionRepo = AppDataSource.getRepository(LiveSessionEntity);
        const session = await liveSessionRepo.findOne({
          where: { presentationId: parsed.data.presentationId, isLive: true },
          order: { createdAt: "DESC" }
        });
        if (session) {
          session.currentSlideIndex = parsed.data.slideIndex;
          await liveSessionRepo.save(session);
        }
      } catch (err) {
        logger.error(`[Socket.IO] Failed to update session slide index: ${err}`);
      }

      // Broadcast to participants
      socket.to(`presentation:${parsed.data.presentationId}`).emit("slide-changed", parsed.data.slideIndex);
    });

    // ── participant-ping ──────────────────────────────────────────────────
    socket.on("participant-ping", (data: { presentationId: string, participantId: string }) => {
      if (!checkSocketRateLimit(socket, "participant-ping", 60, 60_000)) return;
      socketEventsTotal.inc({ event: "participant-ping" });

      const parsed = SocketSchemas.participantPing.safeParse(data);
      if (!parsed.success) return;

      // Forward the ping to the presentation room so the presenter can answer
      socket.to(`presentation:${parsed.data.presentationId}`).emit("participant-ping", parsed.data);
    });

    // ── participant-alive ─────────────────────────────────────────────────
    socket.on("participant-alive", (data: { presentationId: string, participantId: string }) => {
      if (!checkSocketRateLimit(socket, "participant-alive", 30, 60_000)) return;
      socketEventsTotal.inc({ event: "participant-alive" });

      const parsed = SocketSchemas.participantAlive.safeParse(data);
      if (!parsed.success) return;

      socket.to(`presentation:${parsed.data.presentationId}`).emit("participant-alive", parsed.data);
    });

    // ── remove-participant ────────────────────────────────────────────────
    socket.on("remove-participant", async (participantId: string) => {
      if (!checkSocketRateLimit(socket, "remove-participant", 20, 60_000)) return;
      socketEventsTotal.inc({ event: "remove-participant" });

      const parsed = SocketSchemas.removeParticipant.safeParse(participantId);
      if (!parsed.success) {
        logger.warn(`[Socket.IO] Invalid remove-participant payload from ${socket.id}`);
        return;
      }

      try {
        const participantRepo = AppDataSource.getRepository(ParticipantEntity);
        await participantRepo.delete({ id: parsed.data });
        logger.debug(`[Socket.IO] Automatically removed disconnected participant: ${parsed.data}`);
      } catch (err) {
        logger.error(`[Socket.IO] Failed to remove participant: ${err}`);
      }
    });

    // ── presenter-pong ────────────────────────────────────────────────────
    socket.on("presenter-pong", (data: { presentationId: string, participantId: string }) => {
      if (!checkSocketRateLimit(socket, "presenter-pong", 2000, 60_000)) return;
      socketEventsTotal.inc({ event: "presenter-pong" });

      const parsed = SocketSchemas.presenterPong.safeParse(data);
      if (!parsed.success) return;

      // Forward the pong back to the presentation room so the specific participant receives it
      socket.to(`presentation:${parsed.data.presentationId}`).emit("presenter-pong", parsed.data);
    });

    // ── disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      activeSocketConnections.dec();
      cleanupSocketBuckets(socket.id);
      logger.debug(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}

export function getSocketIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}
