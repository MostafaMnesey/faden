import slugify from "slugify";
import * as dbService from "../../database/dbService.js";
import type { AppError } from "../../Types/error.js";
import { customAlphabet } from "nanoid";
import { config } from "../../configs/index.js";

export const generateSlug = async ({name, model}: {name: string, model: string}): Promise<string> => {
  let slug = slugify(name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await dbService.findOne({
    model: model,
    where: { slug },
  });

  if (existing) {
    slug = `${slug}-${customAlphabet(config.alphabets, config.nanoidLength)()}`;
  }
  return slug;
};

