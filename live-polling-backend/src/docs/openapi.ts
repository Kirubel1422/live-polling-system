import { ENV } from "src/constants/dotenv";

/**
 * OpenAPI 3.0 specification for the Live Polling API.
 * This is a manual spec — kept lightweight for the initial iteration.
 */
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Live Polling API",
    version: "1.0.0",
    description:
      "Backend API for the Live Polling System — presentations, real-time voting, AI generation, and more.",
  },
  servers: [
    {
      url: `http://localhost:${ENV.APP_PORT}/api`,
      description: "Local development",
    },
  ],
  tags: [{ name: "Health", description: "Health checks" }, { name: "Metrics", description: "Prometheus metrics" }],
  paths: {
    "/health/live": {
      get: {
        tags: ["Health"],
        summary: "Liveness check",
        responses: { "200": { description: "Service is alive" } },
      },
    },
    "/health/ready": {
      get: {
        tags: ["Health"],
        summary: "Readiness check",
        responses: {
          "200": { description: "Service is ready" },
          "503": { description: "Service is not ready" },
        },
      },
    },
    "/metrics": {
      get: {
        tags: ["Metrics"],
        summary: "Prometheus metrics (protected in production)",
        responses: {
          "200": { description: "Prometheus text metrics" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
};
