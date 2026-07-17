import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";

import { globalErrorHandling } from "./Utils/Response.js";
import rootRouter from "./index.routes.js";

const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT || 3001;

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : [
      "http://localhost:3000",
      "http://localhost:5173",
    ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    }),
  );
  app.use(
    morgan("dev", {
      stream: {
        write: (message) => {
          console.log(message.trim());
        },
      },
    })
  );
  app.use(express.json());

  // Static Files
  app.use("/uploads", express.static(path.resolve("uploads")));

  // Root Router
  app.use(rootRouter);

  app.use(globalErrorHandling);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};
export default bootstrap;
