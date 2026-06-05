import { Request, Response, NextFunction } from "express";
import client, { Registry, Counter, Histogram, Gauge } from "prom-client";

// Create a custom registry so we don't pollute the default
export const metricsRegistry = new Registry();

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register: metricsRegistry });

// ── HTTP metrics ────────────────────────────────────────────────────────────

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [metricsRegistry],
});

export const httpRequestDurationMs = new Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [metricsRegistry],
});

// ── Socket.IO metrics ───────────────────────────────────────────────────────

export const activeSocketConnections = new Gauge({
  name: "active_socket_connections",
  help: "Number of active Socket.IO connections",
  registers: [metricsRegistry],
});

export const socketEventsTotal = new Counter({
  name: "socket_events_total",
  help: "Total number of Socket.IO events processed",
  labelNames: ["event"] as const,
  registers: [metricsRegistry],
});

// ── Business metrics ────────────────────────────────────────────────────────

export const participantJoinTotal = new Counter({
  name: "participant_join_total",
  help: "Total number of participant joins",
  registers: [metricsRegistry],
});

export const participantResponseTotal = new Counter({
  name: "participant_response_total",
  help: "Total number of participant responses",
  registers: [metricsRegistry],
});

export const participantUpvoteTotal = new Counter({
  name: "participant_upvote_total",
  help: "Total number of participant upvotes",
  registers: [metricsRegistry],
});

export const aiGenerationTotal = new Counter({
  name: "ai_generation_total",
  help: "Total number of AI generation requests",
  registers: [metricsRegistry],
});

export const aiGenerationFailedTotal = new Counter({
  name: "ai_generation_failed_total",
  help: "Total number of failed AI generation requests",
  registers: [metricsRegistry],
});

export const rateLimitedRequestsTotal = new Counter({
  name: "rate_limited_requests_total",
  help: "Total number of rate limited requests",
  registers: [metricsRegistry],
});

export const backgroundJobsCompletedTotal = new Counter({
  name: "background_jobs_completed_total",
  help: "Total background jobs completed",
  labelNames: ["queue"] as const,
  registers: [metricsRegistry],
});

export const backgroundJobsFailedTotal = new Counter({
  name: "background_jobs_failed_total",
  help: "Total background jobs failed",
  labelNames: ["queue"] as const,
  registers: [metricsRegistry],
});

// ── Middleware to track HTTP metrics ─────────────────────────────────────────

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    });

    httpRequestDurationMs.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode.toString(),
      },
      duration
    );
  });

  next();
}
