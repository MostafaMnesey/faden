import * as dbService from "../../../database/dbService.js";
import { ensureExists } from "../../../database/genericService.js";

export const getPublicClients = async (args: {
  page?: unknown;
  limit?: unknown;
  category?: string;
  search?: string;
}) => {
  const where: Record<string, unknown> = {};

  if (args.category) {
    where.category = { equals: args.category, mode: "insensitive" };
  }

  if (args.search) {
    where.name = { contains: args.search, mode: "insensitive" };
  }

  return await dbService.findManyWithPaginationAndCount({
    model: "client",
    where,
    page: args.page ? Number(args.page) : 1,
    limit: args.limit ? Number(args.limit) : 100,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

export const getPublicClientById = async ({ id }: { id: string }) => {
  return await ensureExists({
    model: "client",
    where: { id },
    message: "CLIENT_NOT_FOUND",
  });
};
