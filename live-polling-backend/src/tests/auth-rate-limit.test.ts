import { describe, it, expect } from "vitest";

describe("Rate Limiters", () => {
  it("exports all expected limiters", async () => {
    const limiters = await import("src/utils/rate-limit/rate-limiters");
    expect(limiters.authLimiter).toBeDefined();
    expect(limiters.passwordResetLimiter).toBeDefined();
    expect(limiters.participantJoinLimiter).toBeDefined();
    expect(limiters.participantResponseLimiter).toBeDefined();
    expect(limiters.aiGenerationLimiter).toBeDefined();
    expect(limiters.userMutationLimiter).toBeDefined();
    expect(limiters.templateMutationLimiter).toBeDefined();
    expect(limiters.generalApiLimiter).toBeDefined();
  });
});
