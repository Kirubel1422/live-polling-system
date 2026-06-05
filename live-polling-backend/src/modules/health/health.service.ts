import { AppDataSource } from "src/configs/database";
import { redisClient } from "src/configs/redis";

export interface HealthStatus {
  status: "ok" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  checks: {
    database: { status: "ok" | "error"; message?: string };
    redis: { status: "ok" | "error"; message?: string };
  };
}

export class HealthService {
  /**
   * Liveness: is the process alive?
   */
  static live(): { status: string } {
    return { status: "ok" };
  }

  /**
   * Readiness: are critical dependencies available?
   */
  static async ready(): Promise<HealthStatus> {
    const checks = {
      database: { status: "ok" as "ok" | "error", message: undefined as string | undefined },
      redis: { status: "ok" as "ok" | "error", message: undefined as string | undefined },
    };

    // Check PostgreSQL
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query("SELECT 1");
      } else {
        checks.database = { status: "error", message: "DataSource not initialized" };
      }
    } catch (error) {
      checks.database = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Check Redis
    try {
      if (redisClient.isOpen) {
        await redisClient.ping();
      } else {
        checks.redis = { status: "error", message: "Redis client not connected" };
      }
    } catch (error) {
      checks.redis = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }

    const allOk = checks.database.status === "ok" && checks.redis.status === "ok";

    return {
      status: allOk ? "ok" : "unhealthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
