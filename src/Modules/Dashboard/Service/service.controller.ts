import { Request, Response, NextFunction } from "express";
import {
  asyncHandler,
  successResponse,
  errorResponse,
} from "../../../Utils/Response.js";
import * as serviceService from "./service.service.js";
import type { CustomMulterFile } from "../../../Types/request.js";

// ─── Service Controllers ──────────────────────────────────────────────────────

export const createService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description } = req.body;
    const result = await serviceService.createService({
      name,
      slug,
      description,
    });
    return successResponse({
      res,
      status: 201,
      data: result,
      message: "SERVICE_CREATED",
    });
  },
);

export const getServices = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page as unknown as number | undefined;
    const limit = req.query.limit as unknown as number | undefined;
    const result = await serviceService.getServices({ page, limit });
    return successResponse({ res, status: 200, data: result });
  },
);

export const getServiceById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await serviceService.getServiceById({ id });
    return successResponse({ res, status: 200, data: result });
  },
);

export const updateService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const { name, slug, description } = req.body;
    const result = await serviceService.updateService({
      id,
      name,
      slug,
      description,
    });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "SERVICE_UPDATED",
    });
  },
);

export const deleteService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await serviceService.deleteService({ id });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "SERVICE_DELETED",
    });
  },
);

// ─── Section Controllers ──────────────────────────────────────────────────────

export const addSection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id as string;
    const { title, subtitle, type, content, order } = req.body;
    const file = req.file as CustomMulterFile | undefined;
    const img = file?.finalPath;

    const result = await serviceService.addSection({
      serviceId,
      title,
      subtitle,
      type,
      content,
      order,
      img,
    });

    return successResponse({
      res,
      status: 201,
      data: result,
      message: "SECTION_ADDED",
    });
  },
);

export const updateSection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sectionId = req.params.sectionId as string;
    const { title, subtitle, type, content, order } = req.body;
    const file = req.file as CustomMulterFile | undefined;
    const img = file?.finalPath;

    const result = await serviceService.updateSection({
      sectionId,
      title,
      subtitle,
      type,
      content,
      order,
      img,
    });

    return successResponse({
      res,
      status: 200,
      data: result,
      message: "SECTION_UPDATED",
    });
  },
);

export const deleteSection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sectionId = req.params.sectionId as string;
    const result = await serviceService.deleteSection({ sectionId });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "SECTION_DELETED",
    });
  },
);

// ─── Project Controllers ──────────────────────────────────────────────────────

export const addProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id as string;
    const { title } = req.body;

    const file = req.file as CustomMulterFile | undefined;
    if (!file || !file.finalPath) {
      return errorResponse({
        req,
        next,
        message: "PROJECT_IMAGE_REQUIRED",
        status: 400,
      });
    }
    const img = file.finalPath;

    const result = await serviceService.addProject({
      serviceId,
      title,
      img,
    });

    return successResponse({
      res,
      status: 201,
      data: result,
      message: "PROJECT_ADDED",
    });
  },
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.projectId as string;
    const { title } = req.body;
    const file = req.file as CustomMulterFile | undefined;
    const img = file?.finalPath;

    const result = await serviceService.updateProject({
      projectId,
      title,
      img,
    });

    return successResponse({
      res,
      status: 200,
      data: result,
      message: "PROJECT_UPDATED",
    });
  },
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.projectId as string;
    const result = await serviceService.deleteProject({ projectId });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "PROJECT_DELETED",
    });
  },
);
