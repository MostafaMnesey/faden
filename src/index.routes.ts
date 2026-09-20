import { Router } from "express";
import dashboardRoutes from "./Modules/Dashboard/dashboard.controller.js";
import websiteRoutes from "./Modules/Website/website.controller.js";

const rootRouter = Router();

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
rootRouter.use("/dashboard", dashboardRoutes);

// ─── Website Routes (add module routers here as you build them) ───────────────
rootRouter.use("/website", websiteRoutes);

rootRouter.get("/test", (req, res) => {
  return res.json({ message: "OK" });
});

export default rootRouter;

