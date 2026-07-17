import { asyncHandler, errorResponse } from "../Utils/Response.js";
import { verifyToken } from "../Utils/Token/token.js";
import * as db from "../database/dbService.js";
import { redis } from "../Utils/Radis/Connection.js";

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }
    
    const [bearer, token] = authorization.split(" ");
    if (!token || !bearer || bearer !== "Bearer") {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }

    const decoded = verifyToken({ token });
    if (!decoded || !decoded.id) {
      return errorResponse({ req, next, message: "INVALID_TOKEN", status: 401 });
    }

    const cacheKey = `user:${decoded.id}`;
    let user;

    // Try to get user from cache
    try {
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        user = JSON.parse(cachedUser);
      }
    } catch (cacheError) {
      console.error("Redis Cache Error:", cacheError.message);
    }

    if (!user) {
      user = await db.findFirst({
        model: "user",
        where: {
          id: decoded.id,
        },
        // We include common relations that are usually needed. 
        // Note: These must exist in schema.prisma. 
        // If they don't, this will throw an error.
        include: { role: true }, 
      });

      if (user) {
        try {
          await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });
        } catch (cacheError) {
          console.error("Redis Cache Set Error:", cacheError.message);
        }
      }
    }

    if (!user) {
      return errorResponse({ req, next, message: "USER_NOT_FOUND_OR_UNCONFIRMED", status: 401 });
    }

    req.user = user;
    next();
  });
};

export const authenticationAdmin = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }
    
    const [bearer, token] = authorization.split(" ");
    if (!token || !bearer || bearer !== "Bearer") {
      return errorResponse({ req, next, message: "UNAUTHORIZED", status: 401 });
    }

    const decoded = verifyToken({ token });
    if (!decoded || !decoded.id) {
      return errorResponse({ req, next, message: "INVALID_TOKEN", status: 401 });
    }

    const cacheKey = `admin:${decoded.id}`;
    let admin;

    // Try to get user from cache
    try {
      const cachedAdmin = await redis.get(cacheKey);
      if (cachedAdmin) {
        admin = JSON.parse(cachedAdmin);
      }
    } catch (cacheError) {
      console.error("Redis Cache Error:", cacheError.message);
    }

    if (!admin) {
      admin = await db.findFirst({
        model: "admin",
        where: {
          id: decoded.id,
        },
        // We include common relations that are usually needed. 
        // Note: These must exist in schema.prisma. 
        // If they don't, this will throw an error.
        include: { role: true }, 
      });

      if (admin) {
        try {
          await redis.set(cacheKey, JSON.stringify(admin), { EX: 300 });
        } catch (cacheError) {
          console.error("Redis Cache Set Error:", cacheError.message);
        }
      }
    }

    if (!admin) {
      return errorResponse({ req, next, message: "ADMIN_NOT_FOUND_OR_UNCONFIRMED", status: 401 });
    }

    req.admin = admin;
    req.user = admin;
    next();
  });
};
