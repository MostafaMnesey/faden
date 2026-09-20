import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

// Helper to preprocess stringified JSON or arrays in form-data
const parseArrayOrJson = (val: unknown) => {
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return val;
};

const parseJson = (val: unknown) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

export const createProjectSchema = {
  body: z.object({
    title: generalFeilds.title,
    slug: generalFeilds.slug.optional(),
    location: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    client: z.string().max(200).optional(),
    projectType: z.string().max(200).optional(),
    owner: z.string().max(200).optional(),
    consultant: z.string().max(200).optional(),
    scope: z.string().max(1000).optional(),
    partnershipType: z.string().max(200).optional(),
    totalArea: z.string().max(100).optional(),
    floors: z.string().max(100).optional(),
    structuralType: z.string().max(100).optional(),
    foundationDepth: z.string().max(100).optional(),
    structuralDetails: z.string().max(500).optional(),
    duration: z.string().max(100).optional(),
    status: z.string().max(100).optional(),
    technicalSpecs: z.preprocess(parseJson, z.any().optional()),
    highlightTitle: z.string().max(200).optional(),
    highlightDescription: z.string().max(2000).optional(),
    highlights: z.preprocess(parseArrayOrJson, z.array(z.string()).optional()),
    keyAchievements: z.preprocess(parseArrayOrJson, z.array(z.string()).optional()),
    images: z.preprocess(parseArrayOrJson, z.array(z.string()).optional()),
    order: z.coerce.number().int().min(0).optional(),
    serviceId: generalFeilds.id,
  }),
};

export const updateProjectSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
  body: createProjectSchema.body.partial(),
};

export const getProjectByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const deleteProjectSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const getProjectsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    serviceId: z.string().optional(),
    partnershipType: z.string().optional(),
    search: z.string().optional(),
  }),
};

export type CreateProjectDto = z.infer<typeof createProjectSchema.body>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema.body>;
export type GetProjectsDto = z.infer<typeof getProjectsSchema.query>;
