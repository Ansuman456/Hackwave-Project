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
exports.ProblemAnalysisRecord = void 0;
exports.persistProblemAnalysis = persistProblemAnalysis;
const mongoose_1 = __importStar(require("mongoose"));
const ProblemAnalysisRecordSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true, index: true },
    agent: { type: String, default: "strategist" },
    version: { type: Number, default: 1 },
    output: { type: mongoose_1.Schema.Types.Mixed, required: true },
}, {
    timestamps: true,
});
ProblemAnalysisRecordSchema.index({ projectId: 1, version: 1 });
exports.ProblemAnalysisRecord = mongoose_1.default.model("ProblemAnalysis", ProblemAnalysisRecordSchema);
async function persistProblemAnalysis(projectId, analysis) {
    // Get the next version number
    const lastRecord = await exports.ProblemAnalysisRecord.findOne({ projectId })
        .sort({ version: -1 })
        .lean();
    const nextVersion = lastRecord ? lastRecord.version + 1 : 1;
    await exports.ProblemAnalysisRecord.create({
        projectId,
        agent: "strategist",
        version: nextVersion,
        output: analysis,
    });
}
//# sourceMappingURL=ProblemAnalysis.model.js.map