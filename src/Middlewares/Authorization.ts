import { asyncHandler, errorResponse } from "../Utils/Response.js";
import { Request, Response, NextFunction, RequestHandler } from "express";
import type { RequestWithUserAndAdmin } from "../Types/request.js";
import type { AuthorizationArgs, UserRole } from "../Types/authorization.js";

export const authorization = ({ accessRoles = [] }: AuthorizationArgs = {}): RequestHandler => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as RequestWithUserAndAdmin;
    const userRole = (customReq.user?.role || customReq.admin?.role) as UserRole | undefined;

    if (!userRole) {
      return errorResponse({ req, next, message: "ROLE_NOT_FOUND", status: 401 });
    }

    if (!accessRoles.includes(userRole.name)) {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 403 });
    }
    
    next();
  });
};
