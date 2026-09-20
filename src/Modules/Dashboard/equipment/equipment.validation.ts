import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

export const createEquipmentSchema = {
  body: z.object({
    name: generalFeilds.title,
    count: z.coerce.number().int().min(1).default(1),
    category: z.string().max(100).optional(),
    order: z.coerce.number().int().min(0).optional(),
  }),
};

export const updateEquipmentSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
  body: createEquipmentSchema.body.partial(),
};

export const getEquipmentByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const deleteEquipmentSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const getEquipmentSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
};

export type CreateEquipmentDto = z.infer<typeof createEquipmentSchema.body>;
export type UpdateEquipmentDto = z.infer<typeof updateEquipmentSchema.body>;
