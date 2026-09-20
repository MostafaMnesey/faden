import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as projectService from "./project.service.js";
import type { CustomMulterFile } from "../../../Types/request.js";

type UploadedFilesMap = { [fieldname: string]: CustomMulterFile[] };

export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = (req.files || {}) as UploadedFilesMap;

    const mainImg = files.img?.[0]?.finalPath;
    const highlightImg = files.highlightImg?.[0]?.finalPath;
    const uploadedImages = files.images?.map((f) => f.finalPath) || [];

    const bodyImages = req.body.images
      ? Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images]
      : [];

    const finalImages = Array.from(new Set([...uploadedImages, ...bodyImages]));

    const result = await projectService.createProject({
      ...req.body,
      img: mainImg || req.body.img,
      highlightImg: highlightImg || req.body.highlightImg,
      images: finalImages,
    });

    return successResponse({
      res,
      status: 201,
      data: result,
      message: "PROJECT_CREATED",
    });
  }
);

export const getProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, serviceId, partnershipType, search } = req.query;
    const result = await projectService.getProjects({
      page,
      limit,
      serviceId: serviceId as string | undefined,
      partnershipType: partnershipType as string | undefined,
      search: search as string | undefined,
    });
    return successResponse({ res, status: 200, data: result });
  }
);

export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await projectService.getProjectById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const files = (req.files || {}) as UploadedFilesMap;

    const mainImg = files.img?.[0]?.finalPath;
    const highlightImg = files.highlightImg?.[0]?.finalPath;
    const uploadedImages = files.images?.map((f) => f.finalPath);

    const bodyImages = req.body.images
      ? Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images]
      : undefined;

    let finalImages: string[] | undefined = undefined;
    if (uploadedImages !== undefined || bodyImages !== undefined) {
      finalImages = Array.from(
        new Set([...(uploadedImages || []), ...(bodyImages || [])])
      );
    }

    const result = await projectService.updateProject({
      id,
      ...req.body,
      ...(mainImg ? { img: mainImg } : {}),
      ...(highlightImg ? { highlightImg } : {}),
      ...(finalImages !== undefined ? { images: finalImages } : {}),
    });

    return successResponse({
      res,
      status: 200,
      data: result,
      message: "PROJECT_UPDATED",
    });
  }
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await projectService.deleteProject({ id });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "PROJECT_DELETED",
    });
  }
);
