import { Router } from "express";
import { validation } from "../../../Middlewares/Validation.js";
import * as clientController from "./client.controller.js";
import * as clientValidation from "./client.validation.js";

const router = Router();

router.get(
  "/",
  validation(clientValidation.getPublicClientsSchema),
  clientController.getPublicClients
);

router.get(
  "/:id",
  validation(clientValidation.getPublicClientByIdSchema),
  clientController.getPublicClientById
);

export default router;
