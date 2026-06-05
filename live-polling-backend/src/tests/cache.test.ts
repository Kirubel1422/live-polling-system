import { describe, it, expect } from "vitest";

describe("Cache Service", () => {
  it("CacheService exports expected methods", async () => {
    const { CacheService } = await import("src/utils/cache/cache.service");
    expect(typeof CacheService.getJson).toBe("function");
    expect(typeof CacheService.setJson).toBe("function");
    expect(typeof CacheService.deleteKey).toBe("function");
    expect(typeof CacheService.deletePattern).toBe("function");
    expect(typeof CacheService.remember).toBe("function");
  });

  it("CacheKeys builders return expected strings", async () => {
    const { CacheKeys } = await import("src/utils/cache/cache.keys");

    expect(CacheKeys.templatesList()).toBe("template:list");
    expect(CacheKeys.templateById("abc")).toBe("template:id:abc");
    expect(CacheKeys.presentationById("xyz")).toBe("presentation:id:xyz");
    expect(CacheKeys.presentationListByOwner("user1")).toBe("presentation:owner:user1");
    expect(CacheKeys.slidesByPresentationId("pres1")).toBe("slides:pres:pres1");
    expect(CacheKeys.slideById("pres1", "slide1")).toBe("slide:pres1:slide1");
  });

  it("CacheService.getJson returns null when Redis is not connected", async () => {
    const { CacheService } = await import("src/utils/cache/cache.service");
    const result = await CacheService.getJson("nonexistent-key");
    expect(result).toBeNull();
  });
});
