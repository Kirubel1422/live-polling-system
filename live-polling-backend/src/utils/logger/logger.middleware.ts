import logger from "./logger";
import { Request, Response, NextFunction } from "express";

/**
 * Professional HTTP request logger middleware.
 * Logs method, URL, status code, content length, duration, IP, and user-agent.
 * Routes message to correct log level based on response status code.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const requestId = (req as any).requestId || "-";
    const userAgent = req.get("user-agent") || "-";
    const contentLength = res.get("content-length") || 0;

    const message = `${req.ip} - "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode} ${contentLength} - ${duration}ms - "${userAgent}" [ReqID: ${requestId}]`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
};
