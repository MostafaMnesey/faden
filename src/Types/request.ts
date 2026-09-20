import { Request } from "express";

export interface RequestWithUserAndAdmin extends Request {
  user?: Record<string, unknown>;
  admin?: Record<string, unknown>;
}

export interface RequestWithPagination extends Request {
  pagination?: Record<string, unknown>;
}

export interface CustomMulterFile extends Express.Multer.File {
  finalPath?: string;
}
