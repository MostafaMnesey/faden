import { ZodError, ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../Utils/Response.js";
import type { ValidationSchema, ValidationRequestHandler } from "../Types/validation.js";

export const validation = (schema: ValidationSchema): ValidationRequestHandler => {
  const handler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: ZodError<unknown>[] = [];
    const reqAsRecord = req as unknown as Record<string, unknown>;

    for (const key of Object.keys(schema) as Array<keyof ValidationSchema>) {
      const schemaForKey = schema[key];
      if (!schemaForKey) continue;

      let data = reqAsRecord[key];

      if (key === "body") {
        const unflatten = (obj: Record<string, unknown>): Record<string, unknown> => {
          const result: Record<string, unknown> = {};
          for (const k in obj) {
            const parts = k.split(/[\[\].]+/).filter(Boolean);
            let current = result;
            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];
              if (i === parts.length - 1) {
                current[part] = typeof obj[k] === "string" ? (obj[k] as string).trim() : obj[k];
              } else {
                current[part] = (current[part] as Record<string, unknown>) || {};
                current = current[part] as Record<string, unknown>;
              }
            }
          }
          return result;
        };

        const processedBody = unflatten(req.body as Record<string, unknown>);

        // Merge uploaded files into body data
        const filesData = req.files
          ? { files: req.files }
          : req.file
            ? { [req.file.fieldname]: req.file }
            : {};

        data = {
          ...processedBody,
          ...filesData,
        };
      }

      const result = (schemaForKey as ZodObject<ZodRawShape>).safeParse(data);

      if (!result.success) {
        validationErrors.push(result.error);
      } else {
        if (key === "query" || key === "params") {
          Object.assign(req[key], result.data);
        } else if (key === "body") {
          req.body = result.data;
        }
      }
    }

    const errors = validationErrors.flatMap((error) =>
      error.issues.map((issue) => issue.message),
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        status: 400,
        errors,
      });
    }
    next();
  }) as ValidationRequestHandler;

  handler.schema = schema;
  return handler;
};
export { ValidationSchema, ValidationRequestHandler };
