import { Socket } from "socket.io";
import logger from "src/utils/logger/logger";

/**
 * Simple per-socket in-memory rate limiter for Socket.IO events.
 * Tracks event counts per socket per window.
 */
interface SocketBucket {
  count: number;
  resetAt: number;
}

const socketBuckets = new Map<string, SocketBucket>();

/**
 * Returns true if the socket event should be ALLOWED.
 * Returns false if rate limit is exceeded.
 */
export function checkSocketRateLimit(
  socket: Socket,
  eventName: string,
  maxPerWindow: number = 30,
  windowMs: number = 60_000
): boolean {
  const key = `${socket.id}:${eventName}`;
  const now = Date.now();
  const bucket = socketBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    socketBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  bucket.count++;
  if (bucket.count > maxPerWindow) {
    logger.warn(
      `[Socket Rate Limit] Socket ${socket.id} exceeded limit for event "${eventName}" (${bucket.count}/${maxPerWindow})`
    );
    return false;
  }

  return true;
}

/**
 * Clean up buckets for a disconnected socket.
 */
export function cleanupSocketBuckets(socketId: string): void {
  for (const key of socketBuckets.keys()) {
    if (key.startsWith(`${socketId}:`)) {
      socketBuckets.delete(key);
    }
  }
}
