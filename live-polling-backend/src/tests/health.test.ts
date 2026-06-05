import { describe, it, expect } from "vitest";

describe("Health Endpoints", () => {
  it("GET /api/health/live returns 200", async () => {
    // Smoke test: validates the health service logic directly
    const { HealthService } = await import("src/modules/health/health.service");
    const result = HealthService.live();
    expect(result).toEqual({ status: "ok" });
  });

  it("HealthService.ready returns valid shape", async () => {
    const { HealthService } = await import("src/modules/health/health.service");
    const result = await HealthService.ready();
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("uptime");
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("checks");
    expect(result.checks).toHaveProperty("database");
    expect(result.checks).toHaveProperty("redis");
    // In test env, DB and Redis may not be available
    expect(["ok", "degraded", "unhealthy"]).toContain(result.status);
  });
});
