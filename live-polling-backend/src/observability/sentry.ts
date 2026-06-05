import * as Sentry from "@sentry/node";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

/**
 * Initialize Sentry error tracking.
 * Safe to call even when DSN is not configured — it simply no-ops.
 */
export function initSentry(): void {
  if (!ENV.SENTRY_DSN) {
    logger.info("[Sentry] DSN not configured, skipping initialization.");
    return;
  }

  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.NODE_ENV,
    tracesSampleRate: ENV.NODE_ENV === "production" ? 0.2 : 1.0,
  });

  logger.info("[Sentry] Initialized successfully.");
}

/**
 * Capture an exception to Sentry.
 * Only sends unexpected errors (5xx), not expected 4xx.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!ENV.SENTRY_DSN) return;
  Sentry.captureException(error, { extra: context });
}
