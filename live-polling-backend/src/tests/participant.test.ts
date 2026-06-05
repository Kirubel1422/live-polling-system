import { describe, it, expect } from "vitest";

describe("Participant Validators", () => {
  it("JoinSessionSchema validates correct input", async () => {
    const { JoinSessionSchema } = await import("src/validators/participant.validator");
    const result = JoinSessionSchema.safeParse({
      body: { joinCode: "ABCD12", name: "Test User" },
    });
    expect(result.success).toBe(true);
  });

  it("JoinSessionSchema rejects missing name", async () => {
    const { JoinSessionSchema } = await import("src/validators/participant.validator");
    const result = JoinSessionSchema.safeParse({
      body: { joinCode: "ABCD12" },
    });
    expect(result.success).toBe(false);
  });

  it("JoinSessionSchema rejects short join code", async () => {
    const { JoinSessionSchema } = await import("src/validators/participant.validator");
    const result = JoinSessionSchema.safeParse({
      body: { joinCode: "AB", name: "Test" },
    });
    expect(result.success).toBe(false);
  });

  it("SubmitResponseSchema validates correct input", async () => {
    const { SubmitResponseSchema } = await import("src/validators/participant.validator");
    const result = SubmitResponseSchema.safeParse({
      body: {
        participantId: "123e4567-e89b-12d3-a456-426614174000",
        slideId: "123e4567-e89b-12d3-a456-426614174001",
        value: "answer text",
      },
    });
    expect(result.success).toBe(true);
  });

  it("SubmitResponseSchema rejects invalid UUID", async () => {
    const { SubmitResponseSchema } = await import("src/validators/participant.validator");
    const result = SubmitResponseSchema.safeParse({
      body: {
        participantId: "not-a-uuid",
        slideId: "123e4567-e89b-12d3-a456-426614174001",
        value: "answer",
      },
    });
    expect(result.success).toBe(false);
  });

  it("UpvoteResponseSchema validates correct input", async () => {
    const { UpvoteResponseSchema } = await import("src/validators/participant.validator");
    const result = UpvoteResponseSchema.safeParse({
      body: {
        participantId: "123e4567-e89b-12d3-a456-426614174000",
        responseId: "123e4567-e89b-12d3-a456-426614174001",
      },
    });
    expect(result.success).toBe(true);
  });
});
