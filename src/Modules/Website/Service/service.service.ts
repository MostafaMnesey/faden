import * as dbService from "../../../database/dbService.js";
import { ensureExists, findPaginated } from "../../../database/genericService.js";
import type { GetServicesArgs, GetServiceBySlugArgs } from "./service.validation.js";

/**
 * Get all services with pagination
 */
export const getServices = async ({ page = 1, limit = 10 }: GetServicesArgs = {}) => {
  return await findPaginated({
    model: "service",
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a single service by its slug, including sections (ordered) and projects
 */
export const getServiceBySlug = async ({ slug }: GetServiceBySlugArgs) => {
  return await ensureExists({
    model: "service",
    where: { slug },
    message: "SERVICE_NOT_FOUND",
    include: {
      sections: {
        orderBy: {
          order: "asc",
        },
      },
      projects: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};
