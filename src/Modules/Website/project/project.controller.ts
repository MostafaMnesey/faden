import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as projectService from "./project.service.js";

export const getPublicProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page,
      limit,
      serviceId,
      serviceIds,
      partnershipType,
      hasImages,
      projectsWithoutImages,
      search,
      sortBy,
    } = req.query;

    const result = await projectService.getPublicProjects({
      page: page as unknown as number | undefined,
      limit: limit as unknown as number | undefined,
      serviceId: serviceId as string | undefined,
      serviceIds: serviceIds as unknown as string[] | undefined,
      partnershipType: partnershipType as string | undefined,
      hasImages: hasImages as unknown as boolean | undefined,
      projectsWithoutImages: projectsWithoutImages as unknown as boolean | undefined,
      search: search as string | undefined,
      sortBy: sortBy as "default" | "latest" | "titleAsc" | "titleDesc" | undefined,
    });

    return successResponse({ res, status: 200, data: result });
  }
);

export const getProjectFilterMetadata = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await projectService.getProjectFilterMetadata();
    return successResponse({ res, status: 200, data: result });
  }
);

export const getPublicProjectBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug as string;
    const result = await projectService.getPublicProjectBySlug({ slug });
    return successResponse({ res, status: 200, data: result });
  }
);

export const getPublicProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await projectService.getPublicProjectById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);
