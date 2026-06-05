import { Express } from "express";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import { ENV } from "src/constants/dotenv";

/**
 * Apply security middleware to the Express app.
 * Uses helmet, hpp, and compression.
 */
export function applySecurityMiddleware(app: Express): void {
  // ── Helmet ────────────────────────────────────────────────────────────────
  const isDev = ENV.NODE_ENV === "dev" || ENV.NODE_ENV === "test";

  app.use(
    helmet({
      contentSecurityPolicy: isDev
        ? false // CSP off in dev to avoid blocking Vite, Socket.IO, SSE
        : {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'", ...ENV.CLIENT_URL],
              fontSrc: ["'self'", "https:", "data:"],
              objectSrc: ["'none'"],
              upgradeInsecureRequests:
                ENV.NODE_ENV === "production" ? [] : null,
            },
          },
      crossOriginEmbedderPolicy: isDev ? false : undefined,
    })
  );

  // ── HPP (HTTP Parameter Pollution protection) ─────────────────────────────
  app.use(hpp());

  // ── Compression ───────────────────────────────────────────────────────────
  app.use(compression());
}
