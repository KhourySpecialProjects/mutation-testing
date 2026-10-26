import express, { Application, Request, Response, NextFunction } from "express";
import { bookRouter } from "./routes/bookRouter";


export function createApp(): Application {
  const app = express();

  app.use(express.json());

  // Books routes
  app.use("/books", bookRouter);

  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}