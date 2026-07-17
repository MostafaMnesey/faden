import multer from "multer";
import { customAlphabet } from "nanoid";
import path from "node:path";
import fs from "node:fs";
import slugify from "slugify";

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  pdf: ["application/pdf"],
};

export const localMulterUpload = ({
  customPath = "general",
  validation = [],
} = {}) => {
  let finalPath;

  const fileFilter = function (req, file, cb) {
    if (validation.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error("Invalid File Format"), false);
  };

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let basePath = `uploads/${customPath}`;

      finalPath = basePath;

      const fullPath = path.resolve(`./${basePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },

    filename: function (req, file, cb) {
      // get product title from body
      const title = req.body.title || req.body.en?.title || req.body.ar?.title || "product";

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
      file.finalPath = `${finalPath}/${uniqueFileName}`;

      cb(null, uniqueFileName);
    },
  });

  return multer({
    dest: "./temp",
    storage,
    fileFilter,
  });
};