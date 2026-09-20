import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import { localMulterUpload, fileValidation } from "../../../Utils/Multer/local.multer.js";
import * as equipmentController from "./equipment.controller.js";
import * as equipmentValidation from "./equipment.validation.js";

const router = Router();

const equipmentMulter = localMulterUpload({
  customPath: "equipment",
  validation: fileValidation.image,
}).single("img");

router.post(
  "/",
  equipmentMulter,
  validation(equipmentValidation.createEquipmentSchema),
  equipmentController.createEquipment
);

router.get("/", equipmentController.getEquipment);

router.get(
  "/:id",
  validation(equipmentValidation.getEquipmentByIdSchema),
  equipmentController.getEquipmentById
);

router.put(
  "/:id",
  equipmentMulter,
  validation(equipmentValidation.updateEquipmentSchema),
  equipmentController.updateEquipment
);

router.delete(
  "/:id",
  validation(equipmentValidation.deleteEquipmentSchema),
  equipmentController.deleteEquipment
);

export default router;
