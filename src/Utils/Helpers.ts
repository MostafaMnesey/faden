import * as db from "../database/dbService.js";
import { errorResponse } from "./Response.js";
import { NextFunction, Request } from "express";
import path from "path";
import fs from "fs";
import { standardizeDate, toUTC, getDatesBetweenUTC, combineDateAndTime } from "./Date/time.js";
import type {
  CalculateDiscountArgs,
  ProductMedia,
  ProductInput,
  DestructDataArgs,
  CheckArgs,
  BannerInput,
} from "../Types/helper.js";

const roundPrice = (value: number): number => Math.round((value || 0) * 100) / 100;

export const calculateProductDiscount = ({ oldPrice, newPrice }: CalculateDiscountArgs) => {
  const oldValue = Number(oldPrice);
  const newValue = Number(newPrice);

  if (
    !Number.isFinite(oldValue) ||
    !Number.isFinite(newValue) ||
    oldValue <= 0 ||
    newValue >= oldValue
  ) {
    return {
      discountValue: 0,
      discountPercentage: 0,
    };
  }

  const discountValue = roundPrice(oldValue - newValue);

  return {
    discountValue,
    discountPercentage: roundPrice((discountValue / oldValue) * 100),
  };
};

export const applyProductDiscount = (product: ProductInput): ProductInput => {
  if (!product) return product;

  const discount = calculateProductDiscount({
    oldPrice: product.oldPrice,
    newPrice: product.newPrice,
  });

  product.discountValue = discount.discountValue;
  product.discountPercentage = discount.discountPercentage;

  if (product.media || product.frontImage || product.backImage) {
    const title = product.translations?.[0]?.title || product.title || "Product image";
    const formattedMedia: ProductMedia[] = [];

    // 1. Add front image if present
    if (product.frontImage) {
      formattedMedia.push({
        alt: `${title} front image`,
        src: product.frontImage,
        role: "front_image",
        type: "image",
        isPrimary: true
      });
    }

    // 2. Add back image if present
    if (product.backImage) {
      formattedMedia.push({
        alt: `${title} back image`,
        src: product.backImage,
        role: "back_image",
        type: "image"
      });
    }

    // 3. Add other media from gallery list
    if (Array.isArray(product.media)) {
      product.media.forEach((item: unknown, index: number) => {
        if (item && typeof item === 'object' && 'src' in item) {
          const itemObj = item as { src: string; alt?: string; role?: string; type?: string; isPrimary?: boolean };
          const isDuplicate = formattedMedia.some(m => m.src === itemObj.src);
          if (!isDuplicate) {
            formattedMedia.push({
              alt: itemObj.alt || `${title} gallery image ${index + 1}`,
              src: itemObj.src,
              role: itemObj.role || "gallery",
              type: itemObj.type || "image",
              isPrimary: itemObj.isPrimary || false
            });
          }
        } else if (typeof item === 'string') {
          const isDuplicate = formattedMedia.some(m => m.src === item);
          if (!isDuplicate) {
            formattedMedia.push({
              alt: `${title} gallery image ${index + 1}`,
              src: item,
              role: "gallery",
              type: "image"
            });
          }
        }
      });
    }

    product.media = formattedMedia;
  }

  return product;
};

export const destructData = ({ body, allowed }: DestructDataArgs): Record<string, unknown> => {
  return Object.keys(body).reduce((acc: Record<string, unknown>, key) => {
    if (allowed.includes(key)) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
};

export const checkExist = async ({ model, where, next }: CheckArgs) => {
  const existing = await db.findOne({
    model,
    where,
  });

  if (!existing) {
    errorResponse({
      next,
      status: 404,
      message: "EXIST_NOT_FOUND",
      messageParams: { model },
    });
    return null;
  }

  return existing;
};

export const checkConflict = async ({ model, where, next }: CheckArgs) => {
  const existing = await db.findOne({
    model,
    where,
  });

  if (existing) {
    errorResponse({
      next,
      status: 400,
      message: "EXIST_CONFLICT",
      messageParams: { model },
    });
    return null;
  }

  return existing;
};

export const getEndTime = (startTime: unknown, type: string, duration = 0): Date | null => {
  const start = toUTC(startTime);
  if (!start) return null;

  let end;
  if (duration > 0) {
    end = start.add(duration, "minute");
  } else if (type === "half") {
    end = start.add(30, "minute");
  } else if (type === "full") {
    end = start.add(1, "hour");
  } else {
    end = start;
  }

  return end.toDate();
};

export const normalizeDate = (date: unknown) => {
  return standardizeDate(date);
};

export { getDatesBetweenUTC, combineDateAndTime };

export const getIP = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined) ||
    req.socket.remoteAddress;

  // cleanup IPv6 localhost
  if (!ip || ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "8.8.8.8"; // fallback for local testing
  }

  // fix IPv6 mapped IPv4
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
};

/**
 * Safely deletes a file from the server's filesystem.
 */
export const deleteFile = (relativePath: string): void => {
  if (!relativePath) return;
  try {
    const fullPath = path.resolve(`./${relativePath}`);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(`Error deleting file: ${relativePath}`, error);
  }
};

/**
 * Resolves the polymorphic target (product, category, blog) for a list of banners.
 */
export const resolveBannersTargets = async (bannersList: BannerInput[], lang: string) => {
  if (!bannersList || bannersList.length === 0) return [];

  const productIds: string[] = [];
  const categoryIds: string[] = [];
  const blogIds: string[] = [];

  for (const b of bannersList) {
    if (b.targetType === "product" && b.targetId) {
      productIds.push(b.targetId);
    } else if (b.targetType === "category" && b.targetId) {
      categoryIds.push(b.targetId);
    } else if (b.targetType === "blog" && b.targetId) {
      blogIds.push(b.targetId);
    }
  }

  const [productsData, categoriesData, blogsData] = (await Promise.all([
    productIds.length > 0
      ? db.findMany({
          model: "product",
          where: { id: { in: productIds } },
          include: {
            translations: {
              where: { lang },
              select: { slug: true, title: true, href: true },
            },
          },
        })
      : Promise.resolve([]),
    categoryIds.length > 0
      ? db.findMany({
          model: "category",
          where: { id: { in: categoryIds } },
          include: {
            translations: {
              where: { lang },
              select: { slug: true, title: true, href: true },
            },
          },
        })
      : Promise.resolve([]),
    blogIds.length > 0
      ? db.findMany({
          model: "blog",
          where: { id: { in: blogIds } },
          include: {
            blogTranslations: {
              where: { lang },
              select: { title: true, excerpt: true, category: true, href: true },
            },
          },
        })
      : Promise.resolve([]),
  ])) as [Record<string, unknown>[], Record<string, unknown>[], Record<string, unknown>[]];

  const productMap = new Map(productsData.map((p) => [p.id as string, p]));
  const categoryMap = new Map(categoriesData.map((c) => [c.id as string, c]));
  const blogMap = new Map(blogsData.map((b) => [b.id as string, b]));

  return bannersList.map((banner) => {
    let target: unknown = null;
    if (banner.targetType === "product" && banner.targetId) {
      target = productMap.get(banner.targetId) || null;
    } else if (banner.targetType === "category" && banner.targetId) {
      target = categoryMap.get(banner.targetId) || null;
    } else if (banner.targetType === "blog" && banner.targetId) {
      target = blogMap.get(banner.targetId) || null;
    }

    return {
      id: banner.id,
      image: banner.image,
      targetType: banner.targetType,
      targetId: banner.targetId,
      createdAt: banner.createdAt,
      target,
      product: banner.targetType === "product" ? target : null,
    };
  });
};
