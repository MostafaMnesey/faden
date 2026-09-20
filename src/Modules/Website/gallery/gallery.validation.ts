import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

export const getPublicGallerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
};

export const getPublicGalleryByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export type GetPublicGalleryDto = z.infer<typeof getPublicGallerySchema.query>;
export type GetPublicGalleryByIdDto = z.infer<typeof getPublicGalleryByIdSchema.params>;
