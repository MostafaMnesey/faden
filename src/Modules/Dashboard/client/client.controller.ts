import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as clientService from "./client.service.js";
import type { CustomMulterFile } from "../../../Types/request.js";

export const createClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as CustomMulterFile | undefined;
    const logo = file?.finalPath;

    const result = await clientService.createClient({
      ...req.body,
      logo: logo || req.body.logo,
    });

    return successResponse({
      res,
      status: 201,
      data: result,
      message: "CLIENT_CREATED",
    });
  }
);

export const getClients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, search } = req.query;
    const result = await clientService.getClients({
      page: page as unknown as number | undefined,
      limit: limit as unknown as number | undefined,
      category: category as string | undefined,
      search: search as string | undefined,
    });
    return successResponse({ res, status: 200, data: result });
  }
);

export const getClientById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await clientService.getClientById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);

export const updateClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const file = req.file as CustomMulterFile | undefined;
    const logo = file?.finalPath;

    const result = await clientService.updateClient({
      id,
      ...req.body,
      ...(logo ? { logo } : {}),
    });

    return successResponse({
      res,
      status: 200,
      data: result,
      message: "CLIENT_UPDATED",
    });
  }
);

export const deleteClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await clientService.deleteClient({ id });
    return successResponse({
      res,
      status: 200,
      data: result,
      message: "CLIENT_DELETED",
    });
  }
);
