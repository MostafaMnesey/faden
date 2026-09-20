import * as dbService from "../../../database/dbService.js";
import { ensureExists } from "../../../database/genericService.js";
import type {
  CreateClientArgs,
  UpdateClientArgs,
  GetClientsArgs,
  GetClientByIdArgs,
  DeleteClientArgs,
} from "../../../Types/client.js";

export const createClient = async (args: CreateClientArgs) => {
  return await dbService.create({
    model: "client",
    data: {
      name: args.name,
      logo: args.logo,
      websiteUrl: args.websiteUrl,
      category: args.category ?? "Global Partners",
      order: args.order ?? 0,
    },
  });
};

export const getClients = async ({
  page = 1,
  limit = 50,
  category,
  search,
}: GetClientsArgs = {}) => {
  const where: Record<string, unknown> = {};

  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  return await dbService.findManyWithPaginationAndCount({
    model: "client",
    where,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 50,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

export const getClientById = async ({ id }: GetClientByIdArgs) => {
  return await ensureExists({
    model: "client",
    where: { id },
    message: "CLIENT_NOT_FOUND",
  });
};

export const updateClient = async (args: UpdateClientArgs) => {
  await ensureExists({
    model: "client",
    where: { id: args.id },
    message: "CLIENT_NOT_FOUND",
  });

  const updateData: Record<string, unknown> = {};
  if (args.name) updateData.name = args.name;
  if (args.logo) updateData.logo = args.logo;
  if (args.websiteUrl !== undefined) updateData.websiteUrl = args.websiteUrl;
  if (args.category !== undefined) updateData.category = args.category;
  if (args.order !== undefined) updateData.order = args.order;

  return await dbService.updateOne({
    model: "client",
    where: { id: args.id },
    data: updateData,
  });
};

export const deleteClient = async ({ id }: DeleteClientArgs) => {
  await ensureExists({
    model: "client",
    where: { id },
    message: "CLIENT_NOT_FOUND",
  });

  return await dbService.deleteOne({
    model: "client",
    where: { id },
  });
};
