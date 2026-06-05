import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi";
import logger from "src/utils/logger/logger";

/**
 * Register Swagger UI at /api/docs when API_DOCS_ENABLED is true.
 */
export function registerSwagger(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Live Polling API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  }));
  logger.info("[Swagger] API docs available at /api/docs");
}
