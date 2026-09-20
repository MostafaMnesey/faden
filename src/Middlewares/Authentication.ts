import { asyncHandler, errorResponse } from "../Utils/Response.js";
import { verifyToken } from "../Utils/Token/token.js";
import * as db from "../database/dbService.js";
import { redis } from "../Utils/Radis/Connection.js";
import { Request, Response, NextFunction } from "express";
import type { RequestWithUserAndAdmin } from "../Types/request.js";

export const authentication = () => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }
    
    const [bearer, token] = authorization.split(" ");
    if (!token || !bearer || bearer !== "Bearer") {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }

    const decoded = verifyToken({ token }) as { id: string } | null;
    if (!decoded || !decoded.id) {
      return errorResponse({ req, next, message: "INVALID_TOKEN", status: 401 });
    }

    const cacheKey = `user:${decoded.id}`;
    let user: Record<string, unknown> | null = null;

    // Try to get user from cache
    try {
      const cachedUser = await redis.get(cacheKey);
      if (typeof cachedUser === "string") {
        user = JSON.parse(cachedUser) as Record<string, unknown>;
      }
    } catch (cacheError) {
      if (cacheError instanceof Error) {
        console.error("Redis Cache Error:", cacheError.message);
      }
    }

    if (!user) {
      user = (await db.findFirst({
        model: "user",
        where: {
          id: decoded.id,
        },
        include: { role: true }, 
      })) as Record<string, unknown> | null;

      if (user) {
        try {
          await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });
        } catch (cacheError) {
          if (cacheError instanceof Error) {
            console.error("Redis Cache Set Error:", cacheError.message);
          }
        }
      }
    }

    if (!user) {
      return errorResponse({ req, next, message: "USER_NOT_FOUND_OR_UNCONFIRMED", status: 401 });
    }

    (req as RequestWithUserAndAdmin).user = user;
    next();
  });
};

export const authenticationAdmin = () => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }
    
    const [bearer, token] = authorization.split(" ");
    if (!token || !bearer || bearer !== "Bearer") {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }

    const decoded = verifyToken({ token }) as { id: string } | null;
    if (!decoded || !decoded.id) {
      return errorResponse({ req, next, message: "INVALID_TOKEN", status: 401 });
    }

    const cacheKey = `admin:${decoded.id}`;
    let admin: Record<string, unknown> | null = null;

    // Try to get user from cache
    try {
      const cachedAdmin = await redis.get(cacheKey);
      if (typeof cachedAdmin === "string") {
        admin = JSON.parse(cachedAdmin) as Record<string, unknown>;
      }
    } catch (cacheError) {
      if (cacheError instanceof Error) {
        console.error("Redis Cache Error:", cacheError.message);
      }
    }

    if (!admin) {
      admin = (await db.findFirst({
        model: "admin",
        where: {
          id: decoded.id,
        },
        include: { role: true }, 
      })) as Record<string, unknown> | null;

      if (admin) {
        try {
          await redis.set(cacheKey, JSON.stringify(admin), { EX: 300 });
        } catch (cacheError) {
          if (cacheError instanceof Error) {
            console.error("Redis Cache Set Error:", cacheError.message);
          }
        }
      }
    }

    if (!admin) {
      return errorResponse({ req, next, message: "ADMIN_NOT_FOUND_OR_UNCONFIRMED", status: 401 });
    }

    (req as RequestWithUserAndAdmin).admin = admin;
    (req as RequestWithUserAndAdmin).user = admin;
    next();
  });
};
export { RequestWithUserAndAdmin };
