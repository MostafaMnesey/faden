import { ensureExists, findPaginated } from "../../../database/genericService.js";
import type { GetGalleryItemsArgs, GetGalleryItemByIdArgs } from "../../../Types/gallery.js";

/**
 * Get paginated gallery items for the public website
 */
export const getPublicGalleryItems = async ({
  page = 1,
  limit = 9,
}: GetGalleryItemsArgs) => {
  return await findPaginated({
    model: "Gallery",
    page: Number(page),
    limit: Number(limit),
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

/**
 * Get a single public gallery item by ID
 */
export const getPublicGalleryItemById = async ({ id }: GetGalleryItemByIdArgs) => {
  return await ensureExists({
    model: "Gallery",
    where: { id },
    message: "GALLERY_ITEM_NOT_FOUND",
  });
};
