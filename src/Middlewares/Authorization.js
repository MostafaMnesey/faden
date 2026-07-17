import { asyncHandler, errorResponse } from "../Utils/Response.js";
import { findFirst } from "../database/dbService.js";

export const authorization = ({ accessRoles = [] }) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role || req.admin?.role;

    if (!userRole) {
      return errorResponse({ req, next, message: "ROLE_NOT_FOUND", status: 401 });
    }

    if (!accessRoles.includes(userRole.name)) {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 403 });
    }
    
    next();
  });
};
