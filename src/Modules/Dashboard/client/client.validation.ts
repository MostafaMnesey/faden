import { z } from "zod";
import { generalFeilds } from "../../../Utils/GeneralFields/index.js";

export const createClientSchema = {
  body: z.object({
    name: generalFeilds.title,
    websiteUrl: z.string().url().optional().or(z.literal("")),
    category: z.string().max(100).optional(),
    order: z.coerce.number().int().min(0).optional(),
  }),
};

export const updateClientSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
  body: createClientSchema.body.partial(),
};

export const getClientByIdSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const deleteClientSchema = {
  params: z.object({
    id: generalFeilds.id,
  }),
};

export const getClientsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
};

export type CreateClientDto = z.infer<typeof createClientSchema.body>;
export type UpdateClientDto = z.infer<typeof updateClientSchema.body>;
