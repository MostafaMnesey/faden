import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import * as serviceController from "./service.controller.js";
import * as serviceValidation from "./service.validation.js";

const router = Router();

// Public routes for fetching services on the website
router.get(
  "/",
  validation(serviceValidation.getServicesSchema),
  serviceController.getServices
);

router.get(
  "/:slug",
  validation(serviceValidation.getServiceBySlugSchema),
  serviceController.getServiceBySlug
);

export default router;
