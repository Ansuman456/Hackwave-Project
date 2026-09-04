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
exports.TeamAnalysisRecordModel = void 0;
exports.persistTeamAnalysis = persistTeamAnalysis;
exports.selectTechStack = selectTechStack;
exports.getTeamAnalysis = getTeamAnalysis;
const mongoose_1 = __importStar(require("mongoose"));
const TeamAnalysisRecordSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true, index: true },
    teamAnalysisId: { type: String, required: true },
    status: {
        type: String,
        enum: ["running", "completed", "failed"],
        default: "running",
    },
    teamMemberCount: { type: Number, default: 0 },
    feasibilityScore: { type: Number, default: 0 },
    techStackOptionCount: { type: Number, default: 0 },
    selectedTechStackId: { type: String, default: null },
    result: { type: mongoose_1.Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });
TeamAnalysisRecordSchema.index({ projectId: 1, createdAt: -1 });
exports.TeamAnalysisRecordModel = mongoose_1.default.models.TeamAnalysisRecord ||
    mongoose_1.default.model("TeamAnalysisRecord", TeamAnalysisRecordSchema);
async function persistTeamAnalysis(projectId, teamAnalysis) {
    const teamAnalysisId = `ta_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await exports.TeamAnalysisRecordModel.findOneAndUpdate({ projectId }, {
        projectId,
        teamAnalysisId,
        status: "completed",
        teamMemberCount: teamAnalysis.teamMembers.length,
        feasibilityScore: teamAnalysis.feasibility.score,
        techStackOptionCount: teamAnalysis.techStackOptions.length,
        result: teamAnalysis,
        completedAt: new Date(),
    }, { upsert: true });
}
async function selectTechStack(projectId, optionId) {
    const record = await exports.TeamAnalysisRecordModel.findOne({ projectId })
        .sort({ createdAt: -1 })
        .lean();
    if (!record || !record.result)
        return null;
    const teamAnalysis = record.result;
    const selectedOption = teamAnalysis.techStackOptions.find((opt) => opt.optionId === optionId);
    if (!selectedOption)
        return null;
    teamAnalysis.selectedTechStack = selectedOption;
    await exports.TeamAnalysisRecordModel.findOneAndUpdate({ projectId }, {
        selectedTechStackId: optionId,
        result: teamAnalysis,
    });
    return record;
}
async function getTeamAnalysis(projectId) {
    return exports.TeamAnalysisRecordModel.findOne({ projectId })
        .sort({ createdAt: -1 })
        .lean();
}
//# sourceMappingURL=TeamAnalysis.model.js.map