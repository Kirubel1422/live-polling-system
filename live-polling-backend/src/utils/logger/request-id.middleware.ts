import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

/**
 * Attach a unique request ID to each incoming request.
 * Uses the client-provided X-Request-Id header if present,
 * otherwise generates a new UUID v4.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId =
    (req.headers["x-request-id"] as string) || crypto.randomUUID();

  // Make it available to downstream middleware / handlers
  (req as any).requestId = requestId;

  // Echo back to the client
  res.setHeader("X-Request-Id", requestId);

  next();
}
