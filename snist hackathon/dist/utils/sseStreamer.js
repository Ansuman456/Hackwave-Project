"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSSEConnection = registerSSEConnection;
exports.emitEvent = emitEvent;
const uuid_1 = require("uuid");
const projectConnections = new Map();
function registerSSEConnection(projectId, res) {
    if (!projectConnections.has(projectId)) {
        projectConnections.set(projectId, new Set());
    }
    projectConnections.get(projectId).add(res);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    const heartbeat = setInterval(() => {
        res.write(":\n\n");
    }, 30000);
    return () => {
        clearInterval(heartbeat);
        projectConnections.get(projectId)?.delete(res);
        if (projectConnections.get(projectId)?.size === 0) {
            projectConnections.delete(projectId);
        }
    };
}
function emitEvent(projectId, agent, type, message, metadata) {
    const event = {
        id: (0, uuid_1.v4)(),
        projectId,
        timestamp: new Date().toISOString(),
        agent,
        type,
        message,
        metadata,
    };
    const connections = projectConnections.get(projectId);
    if (!connections || connections.size === 0)
        return;
    const data = JSON.stringify(event);
    for (const res of connections) {
        try {
            res.write(`id: ${event.id}\n`);
            res.write(`event: ${type}\n`);
            res.write(`data: ${data}\n\n`);
        }
        catch {
            connections.delete(res);
        }
    }
}
//# sourceMappingURL=sseStreamer.js.map