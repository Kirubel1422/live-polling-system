/**
 * Redis-based rate limit key prefixes.
 * Each prefix is used by express-rate-limit + rate-limit-redis.
 */
export const RateLimitKeys = {
  AUTH: "rl:auth:",
  PASSWORD_RESET: "rl:pw-reset:",
  PARTICIPANT_JOIN: "rl:p-join:",
  PARTICIPANT_RESPONSE: "rl:p-resp:",
  AI_GENERATION: "rl:ai-gen:",
  USER_MUTATION: "rl:user-mut:",
  TEMPLATE_MUTATION: "rl:tpl-mut:",
  GENERAL_API: "rl:api:",
} as const;
