"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const mongodb_1 = require("./config/mongodb");
const hackathon_routes_1 = __importDefault(require("./routes/hackathon.routes"));
async function main() {
    (0, env_1.validateEnv)();
    const config = (0, env_1.getConfig)();
    await (0, mongodb_1.connectMongoDB)();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: "10mb" }));
    app.get("/api/health", (_req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    app.use("/api", hackathon_routes_1.default);
    app.use((err, _req, res, _next) => {
        console.error("[SERVER] Unhandled error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    });
    const server = app.listen(config.PORT, () => {
        console.log(`[SERVER] HackForge backend running on port ${config.PORT}`);
        console.log(`[SERVER] Health check: http://localhost:${config.PORT}/api/health`);
    });
    // Graceful shutdown
    const shutdown = async (signal) => {
        console.log(`[SERVER] ${signal} received. Starting graceful shutdown...`);
        server.close(async () => {
            console.log("[SERVER] HTTP server closed.");
            try {
                await (0, mongodb_1.disconnectMongoDB)();
                console.log("[SERVER] MongoDB disconnected.");
            }
            catch (err) {
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
//# sourceMappingURL=server.js.map