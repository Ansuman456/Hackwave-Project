import mongoose from "mongoose";
import dns from "dns";
import { getConfig } from "./env";

// Fix Node.js DNS SRV lookup issues on Windows / local resolvers
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("[MONGODB] Could not set custom DNS servers:", e);
}

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) {
    console.log("[MONGODB] Already connected");
    return;
  }

  const config = getConfig();

  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("[MONGODB] Connected successfully");
  } catch (error) {
    console.error("[MONGODB] Connection failed:", error);
    throw error;
  }
}

export async function disconnectMongoDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log("[MONGODB] Disconnected");
}

mongoose.connection.on("error", (err) => {
  console.error("[MONGODB] Connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("[MONGODB] Disconnected");
});

export { isConnected };
