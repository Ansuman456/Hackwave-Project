"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnected = void 0;
exports.connectMongoDB = connectMongoDB;
exports.disconnectMongoDB = disconnectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
const env_1 = require("./env");
// Fix Node.js DNS SRV lookup issues on Windows / local resolvers
try {
    dns_1.default.setServers(["8.8.8.8", "8.8.4.4"]);
}
catch (e) {
    console.warn("[MONGODB] Could not set custom DNS servers:", e);
}
let isConnected = false;
exports.isConnected = isConnected;
async function connectMongoDB() {
    if (isConnected) {
        console.log("[MONGODB] Already connected");
        return;
    }
    const config = (0, env_1.getConfig)();
    try {
        await mongoose_1.default.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        exports.isConnected = isConnected = true;
        console.log("[MONGODB] Connected successfully");
    }
    catch (error) {
        console.error("[MONGODB] Connection failed:", error);
        throw error;
    }
}
async function disconnectMongoDB() {
    if (!isConnected)
        return;
    await mongoose_1.default.disconnect();
    exports.isConnected = isConnected = false;
    console.log("[MONGODB] Disconnected");
}
mongoose_1.default.connection.on("error", (err) => {
    console.error("[MONGODB] Connection error:", err);
});
mongoose_1.default.connection.on("disconnected", () => {
    exports.isConnected = isConnected = false;
    console.log("[MONGODB] Disconnected");
});
//# sourceMappingURL=mongodb.js.map