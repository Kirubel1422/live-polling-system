import { z } from "zod";

// ── Join Session ────────────────────────────────────────────────────────────
export const JoinSessionSchema = z.object({
  body: z.object({
    joinCode: z
      .string()
      .min(4, "Join code must be at least 4 characters")
      .max(12, "Join code must be at most 12 characters"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(80, "Name must be at most 80 characters"),
  }),
});

// ── Get Session Data ────────────────────────────────────────────────────────
export const GetSessionDataSchema = z.object({
  params: z.object({
    presentationId: z.string().uuid("Invalid presentation ID"),
  }),
});

// ── Submit Response ─────────────────────────────────────────────────────────
export const SubmitResponseSchema = z.object({
  body: z.object({
    participantId: z.string().uuid("Invalid participant ID"),
    slideId: z.string().uuid("Invalid slide ID"),
    value: z.unknown().refine(
      (v) => {
        // Basic size limit — prevent huge payloads
        const serialized = JSON.stringify(v);
        return serialized.length <= 10_000;
      },
      { message: "Response value exceeds maximum allowed size" }
    ),
  }),
});

// ── Upvote Response ─────────────────────────────────────────────────────────
export const UpvoteResponseSchema = z.object({
  body: z.object({
    participantId: z.string().uuid("Invalid participant ID"),
    responseId: z.string().uuid("Invalid response ID"),
  }),
});

// ── Kick Participant ────────────────────────────────────────────────────────
export const KickParticipantSchema = z.object({
  params: z.object({
    participantId: z.string().uuid("Invalid participant ID"),
  }),
});
