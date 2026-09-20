import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

export const getPublicEquipmentSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
};

export const getPublicEquipmentByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};
