import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import { AppDataSource } from "src/configs/database";
import { LiveSessionEntity } from "src/entities/LiveSession.entity";
import { ParticipantResponseEntity } from "src/entities/ParticipantResponse.entity";

let io: SocketIOServer;

export function initializeSocket(server: Server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] New client connected: ${socket.id}`);

    socket.on("join-presentation", async (presentationId: string) => {
      console.log(`[Socket.io] Socket ${socket.id} joined presentation: ${presentationId}`);
      socket.join(`presentation:${presentationId}`);

      // Fetch and send existing responses for this presentation's active session
      try {
        const liveSessionRepo = AppDataSource.getRepository(LiveSessionEntity);
        const session = await liveSessionRepo.findOne({
          where: { presentationId, isLive: true },
          order: { createdAt: "DESC" }
        });
        if (session) {
          const responseRepo = AppDataSource.getRepository(ParticipantResponseEntity);
          const responses = await responseRepo.find({
            where: { sessionId: session.id }
          });
          
          console.log(`[Socket.io] Sending ${responses.length} existing responses to socket ${socket.id}`);
          socket.emit("existing-responses", responses);
        }
      } catch (err) {
        console.error("[Socket.io] Failed to fetch existing responses on join", err);
      }
    });

    socket.on("presenter-slide-changed", async (data: { presentationId: string, slideIndex: number }) => {
      console.log(`[Socket.io] Presenter ${socket.id} changed slide to ${data.slideIndex} for presentation ${data.presentationId}`);
      
      // Update the active session in the database so late joiners get the right slide
      try {
        const liveSessionRepo = AppDataSource.getRepository(LiveSessionEntity);
        const session = await liveSessionRepo.findOne({
          where: { presentationId: data.presentationId, isLive: true },
          order: { createdAt: "DESC" }
        });
        if (session) {
          session.currentSlideIndex = data.slideIndex;
          await liveSessionRepo.save(session);
        }
      } catch (err) {
        console.error("[Socket.io] Failed to update session slide index", err);
      }

      // Broadcast to participants
      socket.to(`presentation:${data.presentationId}`).emit("slide-changed", data.slideIndex);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
}

export function getSocketIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}
