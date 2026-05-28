// Load env first — before any other imports
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

import { ENV } from "src/constants/dotenv";
import { connectDatabase } from "src/configs/database";
import loggerMiddleware from "src/utils/logger/logger.middleware";
import { errorHandler } from "src/utils/error/error.middleware";
import { ApiError } from "src/utils/api/api.response";
import appRoutes from "src/modules/index.routes";
import passport from "src/configs/passport";

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" })); // presentations can carry many slides
app.use(express.urlencoded({ extended: true }));

// ── Trust proxy (for correct req.ip behind load balancers) ───────────────────
app.set("trust proxy", 1);

// ── Request logger ────────────────────────────────────────────────────────────
app.use(loggerMiddleware);

// ── Cookie parser ─────────────────────────────────────────────────────────────
app.use(cookieParser(ENV.APP_COOKIE_SECRET));

// ── Passport ──────────────────────────────────────────────────────────────────
app.use(passport.initialize());

// ── HTTP server + Socket.io (Socket setup to be added in services/socket.ts) ─
const server = createServer(app);
// initializeSocket(server); // ← uncomment when socket module is built

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", appRoutes);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(req, res, next, err);
});

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req: Request, _res: Response, _next: NextFunction) => {
  throw new ApiError("Route not found", 404, false);
});

// ── Start ─────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDatabase();
  server.listen(ENV.APP_PORT, () => {
    console.log(`Live Polling Backend running on PORT ${ENV.APP_PORT}`);
  });
};

start();
