import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as serviceService from "./service.service.js";

/**
 * Get all services (paginated)
 */
export const getServices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = req.query.page as unknown as number | undefined;
  const limit = req.query.limit as unknown as number | undefined;
  const result = await serviceService.getServices({ page, limit });
  return successResponse({ res, status: 200, data: result });
});

/**
 * Get a single service by slug
 */
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug as string;
  const service = await serviceService.getServiceBySlug({ slug: slug || "" });
  return successResponse({ res, status: 200, data: service });
});
