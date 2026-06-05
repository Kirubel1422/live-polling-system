import { redisClient } from "src/configs/redis";
import logger from "src/utils/logger/logger";

/**
 * Redis-backed cache service.
 * All operations are safe — they log and return null/void on Redis failures
 * so the app degrades gracefully to database queries.
 */
export class CacheService {
  /**
   * Get a JSON value from cache.
   */
  static async getJson<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient.isOpen) return null;
      const raw = await redisClient.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error(`[Cache] getJson error for key "${key}": ${error}`);
      return null;
    }
  }

  /**
   * Set a JSON value in cache with a TTL.
   */
  static async setJson(
    key: string,
    value: unknown,
    ttlSeconds: number
  ): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      logger.error(`[Cache] setJson error for key "${key}": ${error}`);
    }
  }

  /**
   * Delete a single key.
   */
  static async deleteKey(key: string): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      await redisClient.del(key);
    } catch (error) {
      logger.error(`[Cache] deleteKey error for key "${key}": ${error}`);
    }
  }

  /**
   * Delete all keys matching a glob pattern.
   * Uses SCAN to avoid blocking Redis.
   */
  static async deletePattern(pattern: string): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      let cursor = "0";
      do {
        const result = await redisClient.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        cursor = result.cursor;
        if (result.keys.length > 0) {
          await redisClient.del(result.keys);
        }
      } while (cursor !== "0");
    } catch (error) {
      logger.error(`[Cache] deletePattern error for "${pattern}": ${error}`);
    }
  }

  /**
   * Cache-aside (remember) pattern.
   * Returns cached value if present, otherwise calls fetcher, caches, and returns.
   */
  static async remember<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = await CacheService.getJson<T>(key);
    if (cached !== null) {
      return cached;
    }
    const value = await fetcher();
    await CacheService.setJson(key, value, ttlSeconds);
    return value;
  }
}
