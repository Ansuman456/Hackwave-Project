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
exports.InnovationResultModel = void 0;
exports.createInnovationRun = createInnovationRun;
exports.persistInnovationResult = persistInnovationResult;
exports.selectCandidate = selectCandidate;
const mongoose_1 = __importStar(require("mongoose"));
const InnovationResultSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true, index: true },
    innovationId: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ["running", "completed", "failed"],
        default: "running",
    },
    candidateCount: { type: Number, default: 0 },
    selectedCandidateId: { type: String },
    result: { type: mongoose_1.Schema.Types.Mixed },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    error: { type: String },
}, {
    timestamps: true,
});
InnovationResultSchema.index({ projectId: 1, innovationId: 1 }, { unique: true });
exports.InnovationResultModel = mongoose_1.default.model("InnovationResult", InnovationResultSchema);
async function createInnovationRun(projectId, innovationId) {
    return exports.InnovationResultModel.create({
        projectId,
        innovationId,
        status: "running",
        startedAt: new Date(),
    });
}
async function persistInnovationResult(projectId, result) {
    await exports.InnovationResultModel.findOneAndUpdate({ projectId, innovationId: result.innovationId }, {
        status: "completed",
        candidateCount: result.candidateIdeas.length,
        result,
        completedAt: new Date(),
    }, { upsert: true, new: true });
}
async function selectCandidate(projectId, candidateId) {
    // Update the innovation result with the selected candidate
    const record = await exports.InnovationResultModel.findOne({ projectId }).sort({ createdAt: -1 });
    if (record && record.result) {
        const innovation = record.result;
        const selected = innovation.candidateIdeas.find((c) => c.id === candidateId);
        if (selected) {
            innovation.selectedIdea = selected;
            await record.save();
        }
    }
    // Also update the project record
    await exports.InnovationResultModel.findOneAndUpdate({ projectId }, { selectedCandidateId: candidateId });
}
//# sourceMappingURL=InnovationResult.model.js.map