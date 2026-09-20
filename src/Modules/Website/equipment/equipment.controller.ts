import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as equipmentService from "./equipment.service.js";

export const getPublicEquipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, search } = req.query;
    const result = await equipmentService.getPublicEquipment({
      page: page as unknown as number | undefined,
      limit: limit as unknown as number | undefined,
      category: category as string | undefined,
      search: search as string | undefined,
    });
    return successResponse({ res, status: 200, data: result });
  }
);

export const getPublicEquipmentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await equipmentService.getPublicEquipmentById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);
