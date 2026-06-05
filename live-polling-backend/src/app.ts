// ── 1. Load validated ENV first — dotenv.config() is called inside ──────────
import { ENV } from "src/constants/dotenv";

// ── 2. Initialize Sentry early ─────────────────────────────────────────────
import { initSentry } from "src/observability/sentry";
initSentry();

import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

import { connectDatabase, AppDataSource } from "src/configs/database";
import { connectRedis, disconnectRedis } from "src/configs/redis";
import { applySecurityMiddleware } from "src/configs/security";
import { corsOptions } from "src/configs/cors";
import { requestIdMiddleware } from "src/utils/logger/request-id.middleware";
import loggerMiddleware from "src/utils/logger/logger.middleware";
import { metricsMiddleware } from "src/observability/metrics";
import { errorHandler } from "src/utils/error/error.middleware";
import { ApiError } from "src/utils/api/api.response";
import appRoutes from "src/modules/index.routes";
import passport from "src/configs/passport";
import { initializeSocket, getSocketIO } from "src/utils/socket";
import { registerSwagger } from "src/docs/swagger";
import { initQueues, closeQueues } from "src/queues/index";
import { initWorkers, stopWorkers } from "src/workers/index";
import logger from "src/utils/logger/logger";

// ── 3. Create Express app ──────────────────────────────────────────────────
const app = express();

// ── 4. Trust proxy ─────────────────────────────────────────────────────────
app.set("trust proxy", 1);

// ── 5. Request ID ──────────────────────────────────────────────────────────
app.use(requestIdMiddleware);

// ── 6. Logger middleware ───────────────────────────────────────────────────
app.use(loggerMiddleware);

// ── 7. Security middleware (helmet, hpp, compression) ──────────────────────
applySecurityMiddleware(app);

// ── 8. Prometheus metrics middleware ───────────────────────────────────────
app.use(metricsMiddleware);

// ── 9. CORS with allowlist ─────────────────────────────────────────────────
app.use(cors(corsOptions));

// ── 10. Cookie parser ──────────────────────────────────────────────────────
app.use(cookieParser(ENV.APP_COOKIE_SECRET));

// ── 11. Body parsing ───────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" })); // presentations can carry many slides
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ── 12. Passport ───────────────────────────────────────────────────────────
app.use(passport.initialize());

// ── 13. HTTP server + Socket.IO ────────────────────────────────────────────
const server = createServer(app);

// ── 14. API routes ─────────────────────────────────────────────────────────
app.use("/api", appRoutes);

// ── 15. Swagger docs ───────────────────────────────────────────────────────
if (ENV.API_DOCS_ENABLED) {
  registerSwagger(app);
}

// ── 16. 404 fallback (MUST be before error handler) ────────────────────────
app.use((_req: Request, _res: Response, _next: NextFunction) => {
  throw new ApiError("Route not found", 404, false);
});

// ── 17. Global error handler ───────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(req, res, next, err);
});

// ── 18. Startup ────────────────────────────────────────────────────────────
const start = async () => {
  await connectDatabase();
  await connectRedis();
  await initQueues();
  initWorkers();

  await initializeSocket(server);

  server.listen(ENV.APP_PORT, () => {
    logger.info(`Live Polling Backend running on PORT ${ENV.APP_PORT}`);
    logger.info(`Environment: ${ENV.NODE_ENV}`);
    if (ENV.API_DOCS_ENABLED) {
      logger.info(`API Docs: http://localhost:${ENV.APP_PORT}/api/docs`);
    }
  });
};

// ── 19. Graceful shutdown ──────────────────────────────────────────────────
async function gracefulShutdown(signal: string) {
  logger.info(`[Shutdown] Received ${signal}. Starting graceful shutdown...`);

  // 1. Stop accepting new connections
  server.close(() => {
    logger.info("[Shutdown] HTTP server closed.");
  });

  // 2. Close Socket.IO
  try {
    const io = getSocketIO();
    io.close();
    logger.info("[Shutdown] Socket.IO closed.");
  } catch {
    // Socket.IO may not be initialized
  }

  // 3. Stop BullMQ workers and queues
  await stopWorkers();
  await closeQueues();

  // 4. Close Redis
  await disconnectRedis();

  // 5. Close TypeORM
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    logger.info("[Shutdown] Database connection closed.");
  }

  logger.info("[Shutdown] Graceful shutdown complete.");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ── Start the server ───────────────────────────────────────────────────────
start();

// ── Exports for testing ────────────────────────────────────────────────────
export { app, server };
