import { Request, Response, NextFunction } from "express";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as clientService from "./client.service.js";

export const getPublicClients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, search } = req.query;
    const result = await clientService.getPublicClients({
      page: page as unknown as number | undefined,
      limit: limit as unknown as number | undefined,
      category: category as string | undefined,
      search: search as string | undefined,
    });
    return successResponse({ res, status: 200, data: result });
  }
);

export const getPublicClientById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await clientService.getPublicClientById({ id });
    return successResponse({ res, status: 200, data: result });
  }
);
