import express, { Request, Response } from "express";
import helmet from "helmet";
import { config } from "./config/env.config";

export const createServer = () => {
  const app = express();
  app
    .use(helmet())
    .use(express.json({ limit: "100kb" }))
    .use(express.urlencoded({ extended: true }));

  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, environment: config.NODE_ENV });
  });

  return app;
};
