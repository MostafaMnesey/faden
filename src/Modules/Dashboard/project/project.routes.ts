import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import { localMulterUpload, fileValidation } from "../../../Utils/Multer/local.multer.js";
import * as projectController from "./project.controller.js";
import * as projectValidation from "./project.validation.js";

const router = Router();

const projectMediaUpload = localMulterUpload({
  customPath: "projects",
  validation: fileValidation.image,
}).fields([
  { name: "img", maxCount: 1 },
  { name: "highlightImg", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.post(
  "/",
  projectMediaUpload,
  validation(projectValidation.createProjectSchema),
  projectController.createProject
);

router.get("/", projectController.getProjects);

router.get(
  "/:id",
  validation(projectValidation.getProjectByIdSchema),
  projectController.getProjectById
);

router.put(
  "/:id",
  projectMediaUpload,
  validation(projectValidation.updateProjectSchema),
  projectController.updateProject
);

router.delete(
  "/:id",
  validation(projectValidation.deleteProjectSchema),
  projectController.deleteProject
);

export default router;
