import * as dbService from "../../../database/dbService.js";
import { ensureExists } from "../../../database/genericService.js";

export const getPublicEquipment = async (args: {
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
    model: "equipment",
    where,
    page: args.page ? Number(args.page) : 1,
    limit: args.limit ? Number(args.limit) : 50,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

export const getPublicEquipmentById = async ({ id }: { id: string }) => {
  return await ensureExists({
    model: "equipment",
    where: { id },
    message: "EQUIPMENT_NOT_FOUND",
  });
};
