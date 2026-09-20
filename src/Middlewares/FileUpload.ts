import multer from "multer";
import { nanoid } from "nanoid";
import fs from "node:fs";
import path from "node:path";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  file: ["application/pdf", "application/msword"],
  video: ["video/mp4"],
};

export const uploadFile = ({folderName = "general", validation = fileValidation.image}) => {
  const uploadPath = path.resolve(`src/uploads/${folderName}`);

  // Create folder if not exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = nanoid();
      const extension = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${extension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Invalid file format"), false);
  };

  return multer({ storage, fileFilter });
};
