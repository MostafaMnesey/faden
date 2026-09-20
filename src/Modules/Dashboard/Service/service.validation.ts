import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

// ─── Service Schemas ──────────────────────────────────────────────────────────

export const createServiceSchema = {
  body: z.object({
    name: generalFeilds.name,
    slug: generalFeilds.slug.optional(),
    description: generalFeilds.description.or(z.literal("")).optional(),
  }),
};

export const getServicesSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
};

export const getServiceByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const updateServiceSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
  body: z.object({
    name: generalFeilds.name.optional(),
    slug: generalFeilds.slug.optional(),
    description: generalFeilds.description.or(z.literal("")).optional(),
  }),
};

export const deleteServiceSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

// ─── Sections Schemas ─────────────────────────────────────────────────────────

export const addSectionSchema = {
  params: z.object({
    id: generalFeilds.id, // serviceId
  }),
  body: z.object({
    title: generalFeilds.title,
    subtitle: generalFeilds.subtitle.or(z.literal("")).optional(),
    type: z.enum(["OVERVIEW", "BULLETS", "STEPS"] as const, {
      error: (iss) => (iss.input === undefined ? "TYPE_REQUIRED" : "TYPE_INVALID"),
    }),
    content: z.string({
      error: (iss) => (iss.input === undefined ? "CONTENT_REQUIRED" : "CONTENT_STRING"),
    }),
    order: generalFeilds.order,
    img: z.any().optional(), // File object validation is done inside the middleware
  }),
};

export const updateSectionSchema = {
  params: z.object({
    sectionId: generalFeilds.id,
  }),
  body: z.object({
    title: generalFeilds.title.optional(),
    subtitle: generalFeilds.subtitle.or(z.literal("")).optional(),
    type: z.enum(["OVERVIEW", "BULLETS", "STEPS"] as const).optional(),
    content: z.string().optional(),
    order: generalFeilds.order,
    img: z.any().optional(),
  }),
};

export const deleteSectionSchema = {
  params: z.object({
    sectionId: generalFeilds.id,
  }),
};

// ─── Projects Schemas ─────────────────────────────────────────────────────────

export const addProjectSchema = {
  params: z.object({
    id: generalFeilds.id, // serviceId
  }),
  body: z.object({
    title: generalFeilds.title,
    img: z.any(),
  }),
};

export const updateProjectSchema = {
  params: z.object({
    projectId: generalFeilds.id,
  }),
  body: z.object({
    title: generalFeilds.title.optional(),
    img: z.any().optional(),
  }),
};

export const deleteProjectSchema = {
  params: z.object({
    projectId: generalFeilds.id,
  }),
};

// ─── DTOs (inferred from schemas) ────────────────────────────────────────────

export type CreateServiceDto = z.infer<typeof createServiceSchema.body>;
export type GetServicesDto = z.infer<typeof getServicesSchema.query>;
export type GetServiceByIdDto = z.infer<typeof getServiceByIdSchema.params>;
export type UpdateServiceBodyDto = z.infer<typeof updateServiceSchema.body>;
export type UpdateServiceParamsDto = z.infer<typeof updateServiceSchema.params>;
export type DeleteServiceDto = z.infer<typeof deleteServiceSchema.params>;

export type AddSectionParamsDto = z.infer<typeof addSectionSchema.params>;
export type AddSectionBodyDto = z.infer<typeof addSectionSchema.body>;
export type UpdateSectionParamsDto = z.infer<typeof updateSectionSchema.params>;
export type UpdateSectionBodyDto = z.infer<typeof updateSectionSchema.body>;
export type DeleteSectionDto = z.infer<typeof deleteSectionSchema.params>;

export type AddProjectParamsDto = z.infer<typeof addProjectSchema.params>;
export type AddProjectBodyDto = z.infer<typeof addProjectSchema.body>;
export type UpdateProjectParamsDto = z.infer<typeof updateProjectSchema.params>;
export type UpdateProjectBodyDto = z.infer<typeof updateProjectSchema.body>;
export type DeleteProjectDto = z.infer<typeof deleteProjectSchema.params>;

// ─── Service-layer arg types (extend DTOs with extra runtime fields) ──────────

export type CreateServiceArgs = CreateServiceDto;

export type GetServicesArgs = { page?: number; limit?: number };

export type GetServiceByIdArgs = GetServiceByIdDto;

export type UpdateServiceArgs = UpdateServiceParamsDto & UpdateServiceBodyDto;

export type DeleteServiceArgs = DeleteServiceDto;

export type AddSectionArgs = Omit<AddSectionBodyDto, "img"> & {
  serviceId: string;
  img?: string;
};

export type UpdateSectionArgs = UpdateSectionParamsDto & Omit<UpdateSectionBodyDto, "img"> & {
  img?: string;
};

export type DeleteSectionArgs = DeleteSectionDto;

export type AddProjectArgs = Omit<AddProjectBodyDto, "img"> & {
  serviceId: string;
  img: string;
};

export type UpdateProjectArgs = UpdateProjectParamsDto & Omit<UpdateProjectBodyDto, "img"> & {
  img?: string;
};

export type DeleteProjectArgs = DeleteProjectDto;
