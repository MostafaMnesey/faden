import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import * as equipmentController from "./equipment.controller.js";
import * as equipmentValidation from "./equipment.validation.js";

const router = Router();

router.get(
  "/",
  validation(equipmentValidation.getPublicEquipmentSchema),
  equipmentController.getPublicEquipment
);

router.get(
  "/:id",
  validation(equipmentValidation.getPublicEquipmentByIdSchema),
  equipmentController.getPublicEquipmentById
);

export default router;
