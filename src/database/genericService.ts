import * as db from "./dbService.js";

/**
 * Ensures an entity exists in the database or throws a 404 error.
 */
export const ensureExists = async ({
  model,
  where,
  message = "Resource not found",
  messageParams = {},
  include,
  isMessageKey = true,
}: {
  model: string;
  where: any;
  message?: string;
  messageParams?: any;
  include?: any;
  isMessageKey?: boolean;
}): Promise<any> => {
  const item = await db.findOne({ model, where, include });
  if (!item) {
    const error = new Error(message) as any;
    error.cause = 404;
    error.isMessageKey = isMessageKey;
    error.messageParams = messageParams;
    throw error;
  }
  return item;
};

/**
 * Fetches a paginated list of entities with a total count.
 */
export const findPaginated = async ({
  model,
  where = {},
  page = 1,
  limit = 5,
  include,
  orderBy,
}: {
  model: string;
  where?: any;
  page?: number;
  limit?: number;
  include?: any;
  orderBy?: any;
}): Promise<{ items: any[]; metadata: { total: number; totalPages: number; currentPage: number; limit: number } }> => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [items, total] = await Promise.all([
    db.findMany({ model, where, skip, take, include, orderBy }),
    db.count({ model, where }),
  ]);

  return {
    items,
    metadata: {
      total,
      totalPages: Math.ceil(total / take),
      currentPage: Number(page),
      limit: Number(limit),
    },
  };
};
