import { Request, Response } from "express";
import { HealthService } from "./health.service";
import { ApiResp } from "src/utils/api/api.response";

export class HealthController {
  /** GET /api/health/live */
  static live(_req: Request, res: Response): void {
    res.status(200).json(new ApiResp("Service is alive", 200, true, HealthService.live()));
  }

  /** GET /api/health/ready */
  static async ready(_req: Request, res: Response): Promise<void> {
    const health = await HealthService.ready();
    const statusCode = health.status === "ok" ? 200 : 503;
    res.status(statusCode).json(new ApiResp(
      health.status === "ok" ? "Service is ready" : "Service is not ready",
      statusCode,
      health.status === "ok",
      health
    ));
  }

  /** GET /api/health */
  static async combined(_req: Request, res: Response): Promise<void> {
    const health = await HealthService.ready();
    const statusCode = health.status === "ok" ? 200 : 503;
    res.status(statusCode).json(new ApiResp(
      `Health: ${health.status}`,
      statusCode,
      health.status === "ok",
      health
    ));
  }
}
