import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { config } from "./config/env.config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { NotFoundError } from "./errors/not-found.error";

export const createServer = () => {
  const app = express();
  app
    .use(helmet())
    .use(express.json({ limit: "100kb" }))
    .use(express.urlencoded({ extended: true }));

  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, environment: config.NODE_ENV });
  });

  app.use(async (_req: Request, _res: Response, _next: NextFunction) => {
    throw new NotFoundError("API endpoint not found");
  });

  app.use(errorHandler);

  return app;
};
