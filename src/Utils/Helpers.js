import * as db from "../database/dbService.js";
import { errorResponse } from "./Response.js";

const roundPrice = (value) => Math.round((value || 0) * 100) / 100;

export const calculateProductDiscount = ({ oldPrice, newPrice }) => {
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

export const applyProductDiscount = (product) => {
  if (!product) return product;

  const discount = calculateProductDiscount({
    oldPrice: product.oldPrice,
    newPrice: product.newPrice,
  });

  product.discountValue = discount.discountValue;
  product.discountPercentage = discount.discountPercentage;

  if (product.media || product.frontImage || product.backImage) {
    const title = product.translations?.[0]?.title || product.title || "Product image";
    const formattedMedia = [];

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
      product.media.forEach((item, index) => {
        if (item && typeof item === 'object' && item.src) {
          const isDuplicate = formattedMedia.some(m => m.src === item.src);
          if (!isDuplicate) {
            formattedMedia.push({
              alt: item.alt || `${title} gallery image ${index + 1}`,
              src: item.src,
              role: item.role || "gallery",
              type: item.type || "image",
              isPrimary: item.isPrimary || false
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

export const destructData = ({ body, allowed }) => {
  return Object.keys(body).reduce((acc, key) => {
    if (allowed.includes(key)) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
};

export const checkExist = async ({ model, where, next }) => {
  const existing = await db.findOne({
    model,
    where,
  });

  if (!existing) {
    return errorResponse({
      next,
      status: 404,
      message: "EXIST_NOT_FOUND",
      messageParams: { model },
    });
  }

  return existing;
};

export const checkConflict = async ({ model, where, next }) => {
  const existing = await db.findOne({
    model,
    where,
  });

  if (existing) {
    return errorResponse({
      next,
      status: 400,
      message: "EXIST_CONFLICT",
      messageParams: { model },
    });
  }

  return existing;
};

import { standardizeDate, toUTC, getDatesBetweenUTC, combineDateAndTime } from "./Date/time.js";

export const getEndTime = (startTime, type, duration = 0) => {
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

export const normalizeDate = (date) => {
  return standardizeDate(date);
};

export { getDatesBetweenUTC, combineDateAndTime };



export const getIP = (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
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
 * @param {string} relativePath - The relative path of the file (e.g., 'uploads/products/image.jpg').
 */
export const deleteFile = (relativePath) => {
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
 * Uses batch querying and Maps to achieve O(N) lookup complexity.
 * Supports a backwards-compatible "product" field.
 */
export const resolveBannersTargets = async (bannersList, lang) => {
  if (!bannersList || bannersList.length === 0) return [];

  const productIds = [];
  const categoryIds = [];
  const blogIds = [];

  for (const b of bannersList) {
    if (b.targetType === "product" && b.targetId) {
      productIds.push(b.targetId);
    } else if (b.targetType === "category" && b.targetId) {
      categoryIds.push(b.targetId);
    } else if (b.targetType === "blog" && b.targetId) {
      blogIds.push(b.targetId);
    }
  }

  const [productsData, categoriesData, blogsData] = await Promise.all([
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
      : [],
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
      : [],
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
      : [],
  ]);

  const productMap = new Map(productsData.map((p) => [p.id, p]));
  const categoryMap = new Map(categoriesData.map((c) => [c.id, c]));
  const blogMap = new Map(blogsData.map((b) => [b.id, b]));

  return bannersList.map((banner) => {
    let target = null;
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
