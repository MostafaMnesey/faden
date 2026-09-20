import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import { localMulterUpload, fileValidation } from "../../../Utils/Multer/local.multer.js";
import * as serviceController from "./service.controller.js";
import * as serviceValidation from "./service.validation.js";

// Note: If you want to restrict these routes to authenticated admins once you define the Admin/User models in your schema,
// you can import and apply the `authenticationAdmin()` middleware here.
// import { authenticationAdmin } from "../../../Middlewares/Authentication.js";

const router = Router();

// Apply auth middleware if needed:
// router.use(authenticationAdmin());

// ─── Service Endpoints ────────────────────────────────────────────────────────
router.post(
  "/",
  validation(serviceValidation.createServiceSchema),
  serviceController.createService
);

router.get(
  "/",
  serviceController.getServices
);

router.get(
  "/:id",
  validation(serviceValidation.getServiceByIdSchema),
  serviceController.getServiceById
);

router.put(
  "/:id",
  validation(serviceValidation.updateServiceSchema),
  serviceController.updateService
);

router.delete(
  "/:id",
  validation(serviceValidation.deleteServiceSchema),
  serviceController.deleteService
);

// ─── Section Endpoints ────────────────────────────────────────────────────────
router.post(
  "/:id/sections",
  localMulterUpload({ customPath: "sections", validation: fileValidation.image }).single("img"),
  validation(serviceValidation.addSectionSchema),
  serviceController.addSection
);

router.put(
  "/sections/:sectionId",
  localMulterUpload({ customPath: "sections", validation: fileValidation.image }).single("img"),
  validation(serviceValidation.updateSectionSchema),
  serviceController.updateSection
);

router.delete(
  "/sections/:sectionId",
  validation(serviceValidation.deleteSectionSchema),
  serviceController.deleteSection
);

// ─── Project Endpoints ────────────────────────────────────────────────────────
router.post(
  "/:id/projects",
  localMulterUpload({ customPath: "projects", validation: fileValidation.image }).single("img"),
  validation(serviceValidation.addProjectSchema),
  serviceController.addProject
);

router.put(
  "/projects/:projectId",
  localMulterUpload({ customPath: "projects", validation: fileValidation.image }).single("img"),
  validation(serviceValidation.updateProjectSchema),
  serviceController.updateProject
);

router.delete(
  "/projects/:projectId",
  validation(serviceValidation.deleteProjectSchema),
  serviceController.deleteProject
);

export default router;
