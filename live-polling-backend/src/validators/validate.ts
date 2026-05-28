import { NextFunction, Request, Response } from "express";
import { ApiError } from "src/utils/api/api.response";
import { AnyZodObject } from "zod";

export default function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      const zodError = error as { errors?: { path: (string | number)[]; message: string }[] };
      const validationErrors = Array.isArray(zodError.errors)
        ? zodError.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
          }))
        : [];

      const customError = new ApiError(
        "Validation Error",
        400,
        false,
        validationErrors
      );
      next(customError);
    }
  };
}
