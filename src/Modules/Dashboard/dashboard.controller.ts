import { Router } from "express";
import clientRouter from "./client/client.routes.js";
import equipmentRouter from "./equipment/equipment.routes.js";
import projectRouter from "./project/project.routes.js";
import serviceRouter from "./Service/service.routes.js";

const dashboardRouter = Router();

dashboardRouter.use("/client", clientRouter);
dashboardRouter.use("/equipment", equipmentRouter);
dashboardRouter.use("/project", projectRouter);
dashboardRouter.use("/service", serviceRouter);

export default dashboardRouter;
