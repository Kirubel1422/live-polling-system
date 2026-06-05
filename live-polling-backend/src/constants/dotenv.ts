import dotenv from "dotenv";
dotenv.config();

import { cleanEnv, str, port, bool, num } from "envalid";

const env = cleanEnv(process.env, {
  // ── Core ──────────────────────────────────────────────────────────────────
  APP_PORT: port({ default: 5000 }),
  NODE_ENV: str({ choices: ["dev", "test", "production"], default: "dev" }),

  // ── Cookie ────────────────────────────────────────────────────────────────
  COOKIE_SECRET: str(),
  COOKIE_DOMAIN: str({ default: "localhost" }),

  // ── Frontend ──────────────────────────────────────────────────────────────
  CLIENT_URL: str({ desc: "Comma-separated list of allowed frontend origins" }),

  // ── PostgreSQL ────────────────────────────────────────────────────────────
  DB_HOST: str(),
  DB_PORT: port({ default: 5432 }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),

  // ── JWT ───────────────────────────────────────────────────────────────────
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: "7d" }),

  // ── Legacy email (kept for backwards compat) ──────────────────────────────
  EMAIL: str({ default: "" }),
  APP_PASSWORD: str({ default: "" }),

  // ── AI ────────────────────────────────────────────────────────────────────
  AI_API_KEY: str({ default: "" }),
  AI_MODEL_NAME: str({ default: "" }),
  AI_CONTEXT_MODEL: str({ default: "" }),

  // ── OAuth – Google ────────────────────────────────────────────────────────
  GOOGLE_CLIENT_ID: str({ default: "" }),
  GOOGLE_CLIENT_SECRET: str({ default: "" }),

  // ── OAuth – GitHub ────────────────────────────────────────────────────────
  GITHUB_CLIENT_ID: str({ default: "" }),
  GITHUB_CLIENT_SECRET: str({ default: "" }),

  // ── Cloudinary ────────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: str({ default: "" }),
  CLOUDINARY_API_KEY: str({ default: "" }),
  CLOUDINARY_API_SECRET: str({ default: "" }),

  // ── SMTP ──────────────────────────────────────────────────────────────────
  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: num({ default: 587 }),
  SMTP_USER: str({ default: "" }),
  SMTP_PASS: str({ default: "" }),

  // ── Redis ─────────────────────────────────────────────────────────────────
  REDIS_URL: str({ default: "redis://localhost:6379" }),

  // ── Sentry ────────────────────────────────────────────────────────────────
  SENTRY_DSN: str({ default: "" }),

  // ── Metrics ───────────────────────────────────────────────────────────────
  METRICS_TOKEN: str({ default: "" }),

  // ── Feature flags ─────────────────────────────────────────────────────────
  RATE_LIMIT_ENABLED: bool({ default: true }),
  SOCKET_REDIS_ADAPTER_ENABLED: bool({ default: false }),
  BULLMQ_ENABLED: bool({ default: false }),
  API_DOCS_ENABLED: bool({ default: true }),
});

/**
 * Validated, typed environment config.
 * All values are parsed and guaranteed to exist at startup.
 */
export const ENV = {
  APP_PORT: env.APP_PORT,
  NODE_ENV: env.NODE_ENV as "dev" | "test" | "production",

  // Cookie
  APP_COOKIE_SECRET: env.COOKIE_SECRET,
  APP_COOKIE_DOMAIN: env.COOKIE_DOMAIN,

  // Frontend (always an array)
  CLIENT_URL: env.CLIENT_URL.split(",").map((u) => u.trim()),

  // PostgreSQL
  DB_HOST: env.DB_HOST,
  DB_PORT: env.DB_PORT,
  DB_USERNAME: env.DB_USERNAME,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_NAME: env.DB_NAME,

  // JWT
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,

  // Legacy email
  APP_EMAIL: env.EMAIL || undefined,
  APP_PASSWORD: env.APP_PASSWORD || undefined,

  // AI
  AI_API_KEY: env.AI_API_KEY || undefined,
  AI_MODEL_NAME: env.AI_MODEL_NAME || undefined,
  AI_CONTEXT_MODEL: env.AI_CONTEXT_MODEL || undefined,

  // OAuth – Google
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || undefined,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET || undefined,

  // OAuth – GitHub
  GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID || undefined,
  GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET || undefined,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME || undefined,
  CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY || undefined,
  CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET || undefined,

  // SMTP
  SMTP_HOST: env.SMTP_HOST || undefined,
  SMTP_PORT: env.SMTP_PORT,
  SMTP_USER: env.SMTP_USER || undefined,
  SMTP_PASS: env.SMTP_PASS || undefined,

  // Redis
  REDIS_URL: env.REDIS_URL,

  // Sentry
  SENTRY_DSN: env.SENTRY_DSN || undefined,

  // Metrics
  METRICS_TOKEN: env.METRICS_TOKEN || undefined,

  // Feature flags
  RATE_LIMIT_ENABLED: env.RATE_LIMIT_ENABLED,
  SOCKET_REDIS_ADAPTER_ENABLED: env.SOCKET_REDIS_ADAPTER_ENABLED,
  BULLMQ_ENABLED: env.BULLMQ_ENABLED,
  API_DOCS_ENABLED: env.API_DOCS_ENABLED,
};
