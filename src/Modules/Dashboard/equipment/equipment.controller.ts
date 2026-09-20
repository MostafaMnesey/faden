import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as equipmentService from "./equipment.service.js";
import type { CustomMulterFile } from "../../../Types/request.js";

export const createEquipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as CustomMulterFile | undefined;
    const img = file?.finalPath;

    const result = await equipmentService.createEquipment({
      ...req.body,
      img: img || req.body.img,
    });

    return successResponse({
      res,
      status: 201,
      data: result,
      message: "EQUIPMENT_CREATED",
    });
  }
);

export const getEquipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, search } = req.query;
    const result = await equipmentService.getEquipment({
      page: page as unknown as number | undefined,
      limit: limit as unknown as number | undefined,
      category: category as string | undefined,
      search: search as string | undefined,
    });
    return successResponse({ res, status: 200, data: result });
  }
);

export const getEquipmentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await equipmentService.getEquipmentById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);

export const updateEquipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const file = req.file as CustomMulterFile | undefined;
    const img = file?.finalPath;

    const result = await equipmentService.updateEquipment({
      id,
      ...req.body,
      ...(img ? { img } : {}),
    });

    return successResponse({
      res,
      status: 200,
      data: result,
      message: "EQUIPMENT_UPDATED",
    });
  }
);

export const deleteEquipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await equipmentService.deleteEquipment({ id });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "EQUIPMENT_DELETED",
    });
  }
);
