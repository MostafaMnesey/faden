import * as dbService from "../../../database/dbService.js";
import { ensureExists } from "../../../database/genericService.js";
import type {
  CreateEquipmentArgs,
  UpdateEquipmentArgs,
  GetEquipmentArgs,
  GetEquipmentByIdArgs,
  DeleteEquipmentArgs,
} from "../../../Types/equipment.js";

export const createEquipment = async (args: CreateEquipmentArgs) => {
  return await dbService.create({
    model: "equipment",
    data: {
      name: args.name,
      count: args.count ?? 1,
      img: args.img,
      category: args.category ?? "Heavy Equipment",
      order: args.order ?? 0,
    },
  });
};

export const getEquipment = async ({
  page = 1,
  limit = 20,
  category,
  search,
}: GetEquipmentArgs = {}) => {
  const where: Record<string, unknown> = {};

  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  return await dbService.findManyWithPaginationAndCount({
    model: "equipment",
    where,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

export const getEquipmentById = async ({ id }: GetEquipmentByIdArgs) => {
  return await ensureExists({
    model: "equipment",
    where: { id },
    message: "EQUIPMENT_NOT_FOUND",
  });
};

export const updateEquipment = async (args: UpdateEquipmentArgs) => {
  await ensureExists({
    model: "equipment",
    where: { id: args.id },
    message: "EQUIPMENT_NOT_FOUND",
  });

  const updateData: Record<string, unknown> = {};
  if (args.name) updateData.name = args.name;
  if (args.count !== undefined) updateData.count = args.count;
  if (args.img) updateData.img = args.img;
  if (args.category !== undefined) updateData.category = args.category;
  if (args.order !== undefined) updateData.order = args.order;

  return await dbService.updateOne({
    model: "equipment",
    where: { id: args.id },
    data: updateData,
  });
};

export const deleteEquipment = async ({ id }: DeleteEquipmentArgs) => {
  await ensureExists({
    model: "equipment",
    where: { id },
    message: "EQUIPMENT_NOT_FOUND",
  });

  return await dbService.deleteOne({
    model: "equipment",
    where: { id },
  });
};
