import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as galleryService from "./gallery.service.js";

/**
 * Get paginated gallery items for the website
 */
export const getPublicGalleryItems = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page as unknown as number | undefined;
    const limit = req.query.limit as unknown as number | undefined;

    const result = await galleryService.getPublicGalleryItems({ page, limit });
    return successResponse({ res, status: 200, data: result });
  }
);

/**
 * Get single gallery item by ID for the website
 */
export const getPublicGalleryItemById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const result = await galleryService.getPublicGalleryItemById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);
