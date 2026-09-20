import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

// Parse multi-value arrays in query params (e.g. serviceIds=id1,id2 or serviceIds[]=id1)
const parseServiceIds = (val: unknown) => {
  if (typeof val === "string") {
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return val;
};

const parseBoolean = (val: unknown) => {
  if (typeof val === "string") {
    if (val.toLowerCase() === "true" || val === "1") return true;
    if (val.toLowerCase() === "false" || val === "0") return false;
  }
  return val;
};

export const getPublicProjectsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    serviceId: z.string().optional(),
    serviceIds: z.preprocess(parseServiceIds, z.array(z.string()).optional()),
    partnershipType: z.string().optional(),
    hasImages: z.preprocess(parseBoolean, z.boolean().optional()),
    projectsWithoutImages: z.preprocess(parseBoolean, z.boolean().optional()),
    search: z.string().optional(),
    sortBy: z.enum(["default", "latest", "titleAsc", "titleDesc"]).optional(),
  }),
};

export const getPublicProjectBySlugSchema = {
  params: z.object({
    slug: z.string().min(1, "SLUG_REQUIRED"),
  }),
};

export const getPublicProjectByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export type GetPublicProjectsDto = z.infer<typeof getPublicProjectsSchema.query>;
export type GetPublicProjectBySlugDto = z.infer<typeof getPublicProjectBySlugSchema.params>;
