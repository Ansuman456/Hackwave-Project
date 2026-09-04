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
exports.ArchitectureResultModel = void 0;
exports.persistArchitectureResult = persistArchitectureResult;
exports.markArchitectureRunning = markArchitectureRunning;
exports.markArchitectureFailed = markArchitectureFailed;
exports.getArchitectureResult = getArchitectureResult;
const mongoose_1 = __importStar(require("mongoose"));
const ArchitectureResultRecordSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true, index: true },
    architectureId: { type: String, required: true },
    status: {
        type: String,
        enum: ["running", "completed", "failed"],
        default: "running",
    },
    componentCount: { type: Number, default: 0 },
    collectionCount: { type: Number, default: 0 },
    endpointCount: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    selectedTechStackId: { type: String, default: "" },
    result: { type: mongoose_1.Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });
ArchitectureResultRecordSchema.index({ projectId: 1, createdAt: -1 });
exports.ArchitectureResultModel = mongoose_1.default.models.ArchitectureResult ||
    mongoose_1.default.model("ArchitectureResult", ArchitectureResultRecordSchema);
async function persistArchitectureResult(projectId, result) {
    await exports.ArchitectureResultModel.findOneAndUpdate({ projectId }, {
        projectId,
        architectureId: result.architectureId,
        status: "completed",
        componentCount: result.components.length,
        collectionCount: result.databaseSchema.length,
        endpointCount: result.apiContracts.length,
        confidence: result.confidence,
        selectedTechStackId: result.selectedTechStack.optionId,
        result,
        completedAt: new Date(),
    }, { upsert: true });
}
async function markArchitectureRunning(projectId, architectureId) {
    await exports.ArchitectureResultModel.findOneAndUpdate({ projectId }, {
        projectId,
        architectureId,
        status: "running",
        startedAt: new Date(),
    }, { upsert: true });
}
async function markArchitectureFailed(projectId, error) {
    await exports.ArchitectureResultModel.findOneAndUpdate({ projectId }, {
        status: "failed",
        error,
        completedAt: new Date(),
    });
}
async function getArchitectureResult(projectId) {
    return exports.ArchitectureResultModel.findOne({ projectId })
        .sort({ createdAt: -1 })
        .lean();
}
//# sourceMappingURL=ArchitectureResult.model.js.map