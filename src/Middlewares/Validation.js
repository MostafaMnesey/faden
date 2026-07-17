import joi from "joi";
import { asyncHandler } from "../Utils/Response.js";

export const validation = (schema) => {                                                                       
  const handler = asyncHandler(async (req, res, next) => {
    const validationErrors = [];

    for (const key of Object.keys(schema)) {
      let data = req[key];

      if (key === "body") {
        // Function to unflatten bracket notation (e.g., "en[title]" -> { en: { title: "..." } })
        const unflatten = (obj) => {
          const result = {};
          for (const k in obj) {
            // Split by brackets or dots
            const parts = k.split(/[\[\].]+/).filter(Boolean);
            let current = result;
            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];
              if (i === parts.length - 1) {
                current[part] =
                  typeof obj[k] === "string" ? obj[k].trim() : obj[k];
              } else {
                current[part] = current[part] || {};
                current = current[part];
              }
            }
          }
          return result;
        };

        const processedBody = unflatten(req.body);

        // Merge uploaded files into body data
        data = {
          ...processedBody,
          ...(req.files || (req.file ? { [req.file.fieldname]: req.file } : {})),
        };
      }

      const validationResult = await schema[key].validate(data, {
        abortEarly: false,
      });
      if (validationResult.error) {
        validationErrors.push(validationResult.error);
      } else {
        if (key === "query" || key === "params") {
          Object.assign(req[key], validationResult.value);
        } else {
          req[key] = validationResult.value;
        }
      }
    }

    const errors = validationErrors.flatMap((error) =>
      error.details.map((detail) => detail.message),
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        status: 400,
        errors,
      });
    }
    next();
  });
  handler.schema = schema;
  return handler;
};
