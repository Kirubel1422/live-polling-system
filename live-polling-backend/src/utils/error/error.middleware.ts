import { NextFunction, Request, Response } from "express";
import logger from "../logger/logger";
import { ApiError } from "../api/api.response";
import { captureException } from "src/observability/sentry";

export async function errorHandler(
  req: Request,
  res: Response,
  _next: NextFunction,
  error: unknown
) {
  const requestId = (req as any).requestId || "-";

  // Log full error details including request context and stack trace
  const errorMessage = error instanceof Error ? error.stack || error.message : String(error);
  logger.error(`[${req.method}] ${req.originalUrl} [${requestId}] - ${errorMessage}`);

  // Custom API Error
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
      success: error.success,
      data: error.data,
      requestId,
    });
  }

  // TypeORM QueryFailedError (e.g. unique constraint violations)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const dbError = error as { code: string; detail?: string };
    if (dbError.code === "23505") {
      return res.status(409).json({
        message: "A record with this value already exists.",
        statusCode: 409,
        success: false,
        data: dbError.detail || {},
        requestId,
      });
    }
    if (dbError.code === "23503") {
      return res.status(400).json({
        message: "Referenced record does not exist.",
        statusCode: 400,
        success: false,
        data: {},
        requestId,
      });
    }
  }

  // JWT / Passport errors
  if (error instanceof Error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Unauthorized — invalid or expired token.",
        statusCode: 401,
        success: false,
        data: {},
        requestId,
      });
    }
  }

  // Unknown fallback — capture to Sentry
  captureException(error, {
    method: req.method,
    url: req.originalUrl,
    requestId,
  });

  return res
    .status(500)
    .json({ message: "Internal Server Error", statusCode: 500, success: false, data: {}, requestId });
}
