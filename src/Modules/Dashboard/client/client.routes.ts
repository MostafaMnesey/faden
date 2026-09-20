import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import { localMulterUpload, fileValidation } from "../../../Utils/Multer/local.multer.js";
import * as clientController from "./client.controller.js";
import * as clientValidation from "./client.validation.js";

const router = Router();

const clientMulter = localMulterUpload({
  customPath: "clients",
  validation: fileValidation.image,
}).single("logo");

router.post(
  "/",
  clientMulter,
  validation(clientValidation.createClientSchema),
  clientController.createClient
);

router.get("/", clientController.getClients);

router.get(
  "/:id",
  validation(clientValidation.getClientByIdSchema),
  clientController.getClientById
);

router.put(
  "/:id",
  clientMulter,
  validation(clientValidation.updateClientSchema),
  clientController.updateClient
);

router.delete(
  "/:id",
  validation(clientValidation.deleteClientSchema),
  clientController.deleteClient
);

export default router;
