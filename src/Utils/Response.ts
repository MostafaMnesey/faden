import multer from "multer";
import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction, RequestHandler } from "express";
import type { AppError } from "../Types/error.js";

// =========================
// 🔹 Async Wrapper
// =========================
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// =========================
// 🔹 Global Error Handler
// =========================
export const globalErrorHandling = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // =========================
  // 🟡 Multer Errors
  // =========================
  if (err instanceof multer.MulterError) {
    const multerMessages: Record<string, string> = {
      LIMIT_UNEXPECTED_FILE: "Unexpected file field",
      LIMIT_FILE_SIZE: "File size exceeds the allowed limit",
      LIMIT_FILE_COUNT: "Too many files uploaded",
      LIMIT_FIELD_KEY: "Field name is too long",
      LIMIT_FIELD_VALUE: "Field value is too long",
      LIMIT_FIELD_COUNT: "Too many fields",
      LIMIT_PART_COUNT: "Too many parts",
    };

    const errorText = multerMessages[err.code] || "File upload error";

    return res.status(400).json({
      message: "error",
      status: 400,
      error: errorText,
    });
  }

  // =========================
  // 🔴 Prisma Known Errors
  // =========================

  const driverAdapterCause = (err?.cause as Record<string, unknown>)?.cause as Record<string, unknown> | undefined;
  if (
    driverAdapterCause?.kind === "UniqueConstraintViolation" ||
    driverAdapterCause?.originalCode === "23505"
  ) {
    const constraintFields = (driverAdapterCause?.constraint as Record<string, unknown>)?.fields as string[] | undefined;
    const fields = constraintFields
      ?.map((f) => f.replace(/"/g, ""))
      .join(", ");
    return res.status(409).json({
      message: "Database error",
      status: 409,
      error: `Duplicate value for: ${fields || "unknown"}`,
      ...(process.env.NODE_ENV !== "production" && { meta: err?.meta }),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let errorText = "Database error";
    let status = 400;

    switch (err.code) {
      case "P2002": {
        const target = (err.meta as Record<string, unknown>)?.target;
        errorText = `Duplicate value for: ${target}`;
        status = 409;
        break;
      }

      case "P2003": {
        const fieldName = (err.meta as Record<string, unknown>)?.field_name as string | undefined;
        errorText = fieldName?.includes("studentId")
          ? "Student not found"
          : `Invalid relation for field: ${fieldName}`;
        status = 400;
        break;
      }

      case "P2025":
        errorText = "Record not found";
        status = 404;
        break;

      default:
        return res.status(status).json({
          message: "Database error",
          status,
          error: err.message,
          ...(process.env.NODE_ENV !== "production" && { meta: err.meta }),
        });
    }

    return res.status(status).json({
      message: "Database error",
      status,
      error: errorText,
      ...(process.env.NODE_ENV !== "production" && { meta: err.meta }),
    });
  }

  // =========================
  // 🟠 Prisma Validation Error
  // =========================
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Validation error",
      status: 400,
      error: err.message,
    });
  }

  // =========================
  // 🔵 Custom / Unknown Errors
  // =========================
  let status = err.cause;

  if (!status || typeof status !== "number") {
    status = err.status || err.statusCode || 500;
  }

  const errorText = err.message || "Internal server error";

  return res.status(status as unknown as number).json({
    message: "error",
    status,
    error: errorText,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};

// =========================
// 🔹 Helpers
// =========================

export interface ErrorResponseArgs {
  req?: Request;
  next: NextFunction;
  status?: number;
  message?: string;
  messageParams?: Record<string, unknown>;
  details?: unknown;
}

export const errorResponse = ({
  req,
  next,
  status = 400,
  message = "error",
  messageParams = {},
  details = null,
}: ErrorResponseArgs): void => {
  const error = new Error(message) as AppError;
  error.cause = status;
  if (details) error.details = details;
  return next(error);
};

export interface SuccessResponseArgs {
  res: Response;
  status?: number;
  data: unknown;
  message?: string;
}

export const successResponse = ({
  res,
  status = 200,
  data,
  message = "success",
}: SuccessResponseArgs): Response => {
  return res.status(status).json({
    message,
    status,
    data,
  });
};
export { AppError };
