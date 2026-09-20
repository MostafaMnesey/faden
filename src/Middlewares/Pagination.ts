import Joi from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";
import type { RequestWithPagination } from "../Types/request.js";

export const paginationValidation = (forWhat = "body"): RequestHandler => {
  const validator = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  });
  const querySchema = validator;
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (forWhat === "body") {
      const validData = validator.validate(req.body);
      if (validData.error) {
        return res.status(400).json({
          message: "Validation error",
          status: 400,
          errors: validData.error.details.map((detail) => detail.message),
        });
      }
      req.body = { ...req.body, ...validData.value };
    } else if (forWhat === "query") {
      const validData = querySchema.validate(req.query, {
        convert: true,
      });
      if (validData.error) {
        return res.status(400).json({
          message: "Validation error",
          status: 400,
          errors: validData.error.details.map((detail) => detail.message),
        });
      }
      (req as RequestWithPagination).pagination = { 
        ...(req.query as Record<string, unknown>), 
        ...(validData.value as Record<string, unknown>) 
      };
    }
    next();
  };
};
export { RequestWithPagination };
