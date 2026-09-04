"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackathonProject = void 0;
exports.addUsageMetrics = addUsageMetrics;
const mongoose_1 = __importStar(require("mongoose"));
const HackathonProjectSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true, unique: true },
    problemStatement: { type: String, required: true },
    resumes: { type: [String], default: [] },
    githubLinks: {
        type: [
            {
                githubProfileUrl: { type: String, required: true },
                username: { type: String, required: true },
                role: { type: String },
            },
        ],
        default: [],
    },
    workflowState: { type: mongoose_1.Schema.Types.Mixed, default: null },
    hackathon: {
        name: String,
        description: String,
        durationHours: Number,
        judgingCriteria: [
            {
                name: String,
                weight: Number,
                description: String,
            },
        ],
        rules: [String],
        restrictions: [String],
        allowedTechnologies: [String],
        forbiddenTechnologies: [String],
    },
    userConstraints: [String],
    teamSize: Number,
    status: {
        type: String,
        enum: ["idle", "running", "paused", "completed", "failed", "cancel_requested", "awaiting_selection"],
        default: "idle",
    },
    lastError: { type: String, default: "" },
    executionErrors: [
        {
            agent: String,
            node: String,
            error: String,
            timestamp: String,
        },
    ],
    usage: {
        geminiCalls: { type: Number, default: 0 },
        geminiSearchCalls: { type: Number, default: 0 },
        deepseekCalls: { type: Number, default: 0 },
        tavilyCalls: { type: Number, default: 0 },
        githubCalls: { type: Number, default: 0 },
        llmTokens: { type: Number, default: 0 },
        cacheHits: { type: Number, default: 0 },
        cacheMisses: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});
exports.HackathonProject = mongoose_1.default.model("HackathonProject", HackathonProjectSchema);
async function addUsageMetrics(projectId, partial) {
    const update = {};
    // Use explicit undefined checks instead of truthy checks.
    // Truthy checks would skip 0 values, which is incorrect when a caller
    // explicitly passes a field set to 0.
    if (partial.geminiCalls !== undefined)
        update["usage.geminiCalls"] = partial.geminiCalls;
    if (partial.geminiSearchCalls !== undefined)
        update["usage.geminiSearchCalls"] = partial.geminiSearchCalls;
    if (partial.deepseekCalls !== undefined)
        update["usage.deepseekCalls"] = partial.deepseekCalls;
    if (partial.tavilyCalls !== undefined)
        update["usage.tavilyCalls"] = partial.tavilyCalls;
    if (partial.githubCalls !== undefined)
        update["usage.githubCalls"] = partial.githubCalls;
    if (partial.llmTokens !== undefined)
        update["usage.llmTokens"] = partial.llmTokens;
    if (partial.cacheHits !== undefined)
        update["usage.cacheHits"] = partial.cacheHits;
    if (partial.cacheMisses !== undefined)
        update["usage.cacheMisses"] = partial.cacheMisses;
    if (Object.keys(update).length > 0) {
        await exports.HackathonProject.findOneAndUpdate({ projectId }, { $inc: update }, { new: true });
    }
    // Sync search-related metrics to active ResearchRun document
    const rrUpdate = {};
    if (partial.geminiSearchCalls !== undefined)
        rrUpdate["metrics.geminiSearchCalls"] = partial.geminiSearchCalls;
    if (partial.tavilyCalls !== undefined)
        rrUpdate["metrics.tavilySearchCalls"] = partial.tavilyCalls;
    if (partial.githubCalls !== undefined)
        rrUpdate["metrics.githubSearchCalls"] = partial.githubCalls;
    const searchTotal = (partial.geminiSearchCalls || 0) +
        (partial.tavilyCalls || 0) +
        (partial.githubCalls || 0);
    if (searchTotal > 0) {
        rrUpdate["metrics.totalSearchCalls"] = searchTotal;
    }
    if (Object.keys(rrUpdate).length > 0) {
        try {
            const { ResearchRun } = await Promise.resolve().then(() => __importStar(require("./ResearchRun.model")));
            await ResearchRun.findOneAndUpdate({ projectId, status: "running" }, { $inc: rrUpdate });
        }
        catch (syncErr) {
            console.error("[addUsageMetrics] Failed to sync metrics to ResearchRun:", syncErr);
        }
    }
}
//# sourceMappingURL=HackathonProject.model.js.map