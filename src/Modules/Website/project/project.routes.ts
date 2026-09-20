import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import * as projectController from "./project.controller.js";
import * as projectValidation from "./project.validation.js";

const router = Router();

router.get(
  "/",
  validation(projectValidation.getPublicProjectsSchema),
  projectController.getPublicProjects
);

router.get("/filters", projectController.getProjectFilterMetadata);

router.get(
  "/id/:id",
  validation(projectValidation.getPublicProjectByIdSchema),
  projectController.getPublicProjectById
);

router.get(
  "/:slug",
  validation(projectValidation.getPublicProjectBySlugSchema),
  projectController.getPublicProjectBySlug
);

export default router;
