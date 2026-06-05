import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "src/configs/redis";
import { ENV } from "src/constants/dotenv";
import { RateLimitKeys } from "./rate-limit-keys";

/**
 * Factory: creates an express-rate-limit middleware backed by Redis.
 * Falls back to in-memory store if Redis is not available or rate limiting is disabled.
 */
function createLimiter(opts: {
  prefix: string;
  windowMs: number;
  max: number;
  message?: string;
}) {
  const store =
    ENV.RATE_LIMIT_ENABLED && redisClient.isOpen
      ? new RedisStore({
          sendCommand: (...args: string[]) =>
            redisClient.sendCommand(args),
          prefix: opts.prefix,
        })
      : undefined;

  return rateLimit({
    windowMs: opts.windowMs,
    max: opts.max,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    message: {
      message: opts.message || "Too many requests, please try again later.",
      statusCode: 429,
      success: false,
      data: {},
    },
    skip: () => !ENV.RATE_LIMIT_ENABLED,
  });
}

// ── Limiters ─────────────────────────────────────────────────────────────────

/** Auth routes: login, register, OAuth initiations */
export const authLimiter = createLimiter({
  prefix: RateLimitKeys.AUTH,
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

/** Password reset / forgot password */
export const passwordResetLimiter = createLimiter({
  prefix: RateLimitKeys.PASSWORD_RESET,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many password reset attempts. Please try again in 1 hour.",
});

/** Participant joining a session */
export const participantJoinLimiter = createLimiter({
  prefix: RateLimitKeys.PARTICIPANT_JOIN,
  windowMs: 60 * 1000, // 1 min
  max: 10,
  message: "Too many join attempts. Please slow down.",
});

/** Participant submitting responses / upvotes */
export const participantResponseLimiter = createLimiter({
  prefix: RateLimitKeys.PARTICIPANT_RESPONSE,
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many submissions. Please slow down.",
});

/** AI generation endpoints */
export const aiGenerationLimiter = createLimiter({
  prefix: RateLimitKeys.AI_GENERATION,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "AI generation limit reached. Please try again in 1 hour.",
});

/** User profile mutations */
export const userMutationLimiter = createLimiter({
  prefix: RateLimitKeys.USER_MUTATION,
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many profile updates. Please try again later.",
});

/** Template CUD operations */
export const templateMutationLimiter = createLimiter({
  prefix: RateLimitKeys.TEMPLATE_MUTATION,
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many template modifications. Please try again later.",
});

/** General API catch-all for protected routes */
export const generalApiLimiter = createLimiter({
  prefix: RateLimitKeys.GENERAL_API,
  windowMs: 60 * 1000,
  max: 120,
  message: "Too many requests. Please slow down.",
});
