import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import * as galleryController from "./gallery.controller.js";
import * as galleryValidation from "./gallery.validation.js";

const router = Router();

// ─── Public Website Gallery Endpoints ────────────────────────────────────────

router.get(
  "/",
  validation(galleryValidation.getPublicGallerySchema),
  galleryController.getPublicGalleryItems
);

router.get(
  "/:id",
  validation(galleryValidation.getPublicGalleryByIdSchema),
  galleryController.getPublicGalleryItemById
);

export default router;
