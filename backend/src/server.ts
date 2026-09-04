import express from "express";
import cors from "cors";
import { getConfig, validateEnv } from "./config/env";
import { connectMongoDB, disconnectMongoDB } from "./config/mongodb";
import hackathonRoutes from "./routes/hackathon.routes";

async function main() {
  validateEnv();
  const config = getConfig();

  await connectMongoDB();

  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", hackathonRoutes);

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("[SERVER] Unhandled error:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  );

  const server = app.listen(config.PORT, () => {
    console.log(`[SERVER] HackForge backend running on port ${config.PORT}`);
    console.log(`[SERVER] Health check: http://localhost:${config.PORT}/api/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`[SERVER] ${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
      console.log("[SERVER] HTTP server closed.");
      try {
        await disconnectMongoDB();
        console.log("[SERVER] MongoDB disconnected.");
      } catch (err) {
        console.error("[SERVER] Error disconnecting MongoDB:", err);
      }
      process.exit(0);
    });

    // Force shutdown after 10s if graceful shutdown stalls
    setTimeout(() => {
      console.error("[SERVER] Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("[SERVER] Fatal error:", err);
  process.exit(1);
});
