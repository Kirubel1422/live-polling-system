import { Request, Response } from "express";
import { metricsRegistry } from "src/observability/metrics";
import { ENV } from "src/constants/dotenv";
import { ApiResp } from "src/utils/api/api.response";

export class MetricsController {
  /** GET /api/metrics */
  static async getMetrics(req: Request, res: Response): Promise<void> {
    // Protect metrics in production with bearer token
    if (ENV.NODE_ENV === "production" && ENV.METRICS_TOKEN) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ENV.METRICS_TOKEN}`) {
        res.status(401).json(new ApiResp("Unauthorized", 401, false));
        return;
      }
    }

    try {
      const metrics = await metricsRegistry.metrics();
      res.setHeader("Content-Type", metricsRegistry.contentType);
      res.status(200).send(metrics);
    } catch (error) {
      res.status(500).json(new ApiResp("Failed to retrieve metrics", 500, false));
    }
  }
}
