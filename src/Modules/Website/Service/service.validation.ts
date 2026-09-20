import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const getServiceBySlugSchema = {
  params: z.object({
    slug: generalFeilds.slug,
  }),
};

export const getServicesSchema = {
  query: z.object({
    page: generalFeilds.page.int().min(1).optional(),
    limit: generalFeilds.limit.int().min(1).optional(),
  }),
};

// ─── DTOs (inferred from schemas) ────────────────────────────────────────────

export type GetServiceBySlugDto = z.infer<typeof getServiceBySlugSchema.params>;
export type GetServicesDto = z.infer<typeof getServicesSchema.query>;

// ─── Service-layer arg types ──────────────────────────────────────────────────

export type GetServiceBySlugArgs = GetServiceBySlugDto;
export type GetServicesArgs = GetServicesDto;
