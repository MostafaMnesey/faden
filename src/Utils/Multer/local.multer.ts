import multer from "multer";
import { customAlphabet } from "nanoid";
import path from "node:path";
import fs from "node:fs";
import slugify from "slugify";
import { Request } from "express";
import type { LocalMulterUploadArgs } from "../../Types/multer.js";
import type { CustomMulterFile } from "../../Types/request.js";

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  pdf: ["application/pdf"],
};

export const localMulterUpload = ({
  customPath = "general",
  validation = [],
}: LocalMulterUploadArgs = {}) => {
  let finalPath: string;

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    if (validation.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error("Invalid File Format"));
  };

  const storage = multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) {
      const basePath = `uploads/${customPath}`;
      finalPath = basePath;
      const fullPath = path.resolve(`./${basePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },

    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) {
      // get product title from body
      const body = req.body as Record<string, unknown>;
      const bodyEn = body.en as Record<string, unknown> | undefined;
      const bodyAr = body.ar as Record<string, unknown> | undefined;
      
      const title = (body.title as string | undefined) || 
                    (bodyEn?.title as string | undefined) || 
                    (bodyAr?.title as string | undefined) || 
                    "product";

      // convert title to slug
      const slugTitle = slugify(title, {
        lower: true,
        strict: true,
      });

      // extension
      const extension = path.extname(file.originalname);

      // unique id
      const uniqueId = customAlphabet(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        5
      )();

      // final file name
      const uniqueFileName = `${slugTitle}-${uniqueId}${extension}`;

      // save path in file object
      const customFile = file as CustomMulterFile;
      customFile.finalPath = `${finalPath}/${uniqueFileName}`;

      cb(null, uniqueFileName);
    },
  });

  return multer({
    dest: "./temp",
    storage,
    fileFilter,
  });
};