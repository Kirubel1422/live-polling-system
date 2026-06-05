import { createClient, RedisClientType } from "redis";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

export const redisClient: RedisClientType = createClient({
  url: ENV.REDIS_URL,
});

redisClient.on("error", (err) => {
  logger.error(`[Redis] Client error: ${err}`);
});

redisClient.on("reconnecting", () => {
  logger.warn("[Redis] Reconnecting...");
});

/**
 * Connect the shared Redis client.
 * Call once during app startup.
 */
export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
    logger.info("[Redis] Connected successfully.");
  } catch (error) {
    logger.error(`[Redis] Connection failed: ${error}`);
    throw error;
  }
}

/**
 * Disconnect the shared Redis client.
 * Call during graceful shutdown.
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      logger.info("[Redis] Disconnected.");
    }
  } catch (error) {
    logger.error(`[Redis] Disconnect error: ${error}`);
  }
}

/**
 * Create a duplicate Redis client.
 * Needed for Socket.IO Redis adapter (pub/sub) and BullMQ.
 */
export function createRedisDuplicate(): RedisClientType {
  return redisClient.duplicate() as RedisClientType;
}
