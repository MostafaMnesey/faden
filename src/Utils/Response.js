import multer from "multer";
import { Prisma } from "@prisma/client";

// =========================
// 🔹 Async Wrapper
// =========================
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// =========================
// 🔹 Global Error Handler
// =========================
export const globalErrorHandling = (err, req, res, next) => {
  // =========================
  // 🟡 Multer Errors
  // =========================
  if (err instanceof multer.MulterError) {
    const multerMessages = {
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

  // Handle DriverAdapterError (e.g. when using a custom DB driver adapter)
  const driverAdapterCause = err?.cause?.cause;
  if (
    driverAdapterCause?.kind === "UniqueConstraintViolation" ||
    driverAdapterCause?.originalCode === "23505"
  ) {
    const fields = driverAdapterCause?.constraint?.fields
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
      case "P2002":
        errorText = `Duplicate value for: ${err.meta?.target}`;
        status = 409;
        break;

      case "P2003":
        errorText = err.meta?.field_name?.includes("studentId")
          ? "Student not found"
          : `Invalid relation for field: ${err.meta?.field_name}`;
        status = 400;
        break;

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

  return res.status(status).json({
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
export const errorResponse = ({
  req,
  next,
  status = 400,
  message = "error",
  messageParams = {},
  details = null,
}) => {
  const error = new Error(message);
  error.cause = status;
  if (details) error.details = details;
  return next(error);
};

export const successResponse = ({
  res,
  status = 200,
  data,
  message = "success",
}) => {
  return res.status(status).json({
    message,
    status,
    data,
  });
};

