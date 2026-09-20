import { Router } from "express";
import clientRouter from "./client/client.routes.js";
import equipmentRouter from "./equipment/equipment.routes.js";
import galleryRouter from "./gallery/gallery.routes.js";
import projectRouter from "./project/project.routes.js";
import serviceRouter from "./Service/service.routes.js";

const websiteRouter = Router();

websiteRouter.use("/client", clientRouter);
websiteRouter.use("/equipment", equipmentRouter);
websiteRouter.use("/gallery", galleryRouter);
websiteRouter.use("/project", projectRouter);
websiteRouter.use("/service", serviceRouter);

export default websiteRouter;
