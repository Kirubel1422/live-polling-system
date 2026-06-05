import { z } from "zod";

/**
 * Socket.IO event payload validators.
 */
export const SocketSchemas = {
  joinPresentation: z.string().uuid("Invalid presentation ID"),

  presenterSlideChanged: z.object({
    presentationId: z.string().uuid("Invalid presentation ID"),
    slideIndex: z.number().int().min(0, "Slide index must be >= 0"),
  }),

  participantPing: z.object({
    presentationId: z.string().uuid("Invalid presentation ID"),
    participantId: z.string().uuid("Invalid participant ID"),
  }),

  participantAlive: z.object({
    presentationId: z.string().uuid("Invalid presentation ID"),
    participantId: z.string().uuid("Invalid participant ID"),
  }),

  removeParticipant: z.string().uuid("Invalid participant ID"),

  presenterPong: z.object({
    presentationId: z.string().uuid("Invalid presentation ID"),
    participantId: z.string().uuid("Invalid participant ID"),
  }),
};
