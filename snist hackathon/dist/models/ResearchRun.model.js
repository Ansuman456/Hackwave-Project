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
exports.ResearchRun = void 0;
exports.createResearchRun = createResearchRun;
exports.updateResearchMetrics = updateResearchMetrics;
exports.completeResearchRun = completeResearchRun;
exports.persistResearchResult = persistResearchResult;
const mongoose_1 = __importStar(require("mongoose"));
const ResearchRunSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true, index: true },
    researchId: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ["running", "completed", "failed", "partial"],
        default: "running",
    },
    mode: {
        type: String,
        enum: ["fast", "balanced", "deep"],
        default: "balanced",
    },
    budget: {
        maxDiscoveryRounds: { type: Number, default: 3 },
        maxInitialQueries: { type: Number, default: 10 },
        maxCandidatesForEnrichment: { type: Number, default: 15 },
        maxEnrichmentRoundsPerCandidate: { type: Number, default: 2 },
    },
    metrics: {
        geminiSearchCalls: { type: Number, default: 0 },
        tavilySearchCalls: { type: Number, default: 0 },
        githubSearchCalls: { type: Number, default: 0 },
        totalSearchCalls: { type: Number, default: 0 },
        sourcesFound: { type: Number, default: 0 },
        uniqueSources: { type: Number, default: 0 },
        candidateEntities: { type: Number, default: 0 },
        enrichedSolutions: { type: Number, default: 0 },
    },
    stoppingReason: { type: String },
    result: { type: mongoose_1.Schema.Types.Mixed },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    error: { type: String },
}, {
    timestamps: true,
});
ResearchRunSchema.index({ projectId: 1, researchId: 1 }, { unique: true });
exports.ResearchRun = mongoose_1.default.model("ResearchRun", ResearchRunSchema);
async function createResearchRun(projectId, researchId, mode, budget) {
    return exports.ResearchRun.create({
        projectId,
        researchId,
        status: "running",
        mode,
        budget,
        metrics: {
            geminiSearchCalls: 0,
            tavilySearchCalls: 0,
            githubSearchCalls: 0,
            totalSearchCalls: 0,
            sourcesFound: 0,
            uniqueSources: 0,
            candidateEntities: 0,
            enrichedSolutions: 0,
        },
        startedAt: new Date(),
    });
}
async function updateResearchMetrics(researchId, metrics) {
    const update = {};
    if (metrics.sourcesFound !== undefined)
        update["metrics.sourcesFound"] = metrics.sourcesFound;
    if (metrics.uniqueSources !== undefined)
        update["metrics.uniqueSources"] = metrics.uniqueSources;
    if (metrics.candidateEntities !== undefined)
        update["metrics.candidateEntities"] = metrics.candidateEntities;
    if (metrics.enrichedSolutions !== undefined)
        update["metrics.enrichedSolutions"] = metrics.enrichedSolutions;
    if (metrics.geminiSearchCalls !== undefined)
        update["metrics.geminiSearchCalls"] = metrics.geminiSearchCalls;
    if (metrics.tavilySearchCalls !== undefined)
        update["metrics.tavilySearchCalls"] = metrics.tavilySearchCalls;
    if (metrics.githubSearchCalls !== undefined)
        update["metrics.githubSearchCalls"] = metrics.githubSearchCalls;
    if (metrics.totalSearchCalls !== undefined)
        update["metrics.totalSearchCalls"] = metrics.totalSearchCalls;
    await exports.ResearchRun.findOneAndUpdate({ researchId }, { $set: update });
}
async function completeResearchRun(researchId, status, result, stoppingReason, error) {
    await exports.ResearchRun.findOneAndUpdate({ researchId }, {
        status,
        result,
        stoppingReason,
        error,
        completedAt: new Date(),
    });
}
async function persistResearchResult(projectId, result) {
    await exports.ResearchRun.findOneAndUpdate({ projectId, researchId: result.researchId }, {
        status: "completed",
        result,
        completedAt: new Date(),
    }, { upsert: true, new: true });
}
//# sourceMappingURL=ResearchRun.model.js.map