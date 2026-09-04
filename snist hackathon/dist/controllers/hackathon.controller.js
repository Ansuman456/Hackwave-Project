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
exports.createHackathon = createHackathon;
exports.getHackathonStatus = getHackathonStatus;
exports.startHackathon = startHackathon;
exports.streamEvents = streamEvents;
exports.getProblemAnalysis = getProblemAnalysis;
exports.getResearchResult = getResearchResult;
exports.getInnovationResult = getInnovationResult;
exports.selectCandidateHandler = selectCandidateHandler;
exports.getTeamAnalysis = getTeamAnalysis;
exports.selectTechStackHandler = selectTechStackHandler;
exports.getArchitectureResult = getArchitectureResult;
const uuid_1 = require("uuid");
const state_1 = require("../graph/state");
const HackathonProject_model_1 = require("../models/HackathonProject.model");
const hackforgeGraph_1 = require("../graph/hackforgeGraph");
const sseStreamer_1 = require("../utils/sseStreamer");
const InnovationResult_model_1 = require("../models/InnovationResult.model");
const TeamAnalysis_model_1 = require("../models/TeamAnalysis.model");
const ArchitectureResult_model_1 = require("../models/ArchitectureResult.model");
function getProjectId(req) {
    return req.params.id;
}
async function createHackathon(req, res) {
    try {
        const input = state_1.StrategistInputSchema.parse(req.body);
        const projectId = (0, uuid_1.v4)();
        const project = await HackathonProject_model_1.HackathonProject.create({
            projectId,
            problemStatement: input.problemStatement,
            resumes: input.resumes || [],
            githubLinks: input.githubLinks || [],
            hackathon: input.hackathon,
            userConstraints: input.userConstraints,
            teamSize: input.teamSize,
            status: "idle",
        });
        res.status(201).json({
            success: true,
            data: {
                projectId: project.projectId,
                status: project.status,
                createdAt: project.createdAt,
            },
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ success: false, error: "Invalid input", details: error.message });
            return;
        }
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function getHackathonStatus(req, res) {
    try {
        const id = getProjectId(req);
        let project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
        if (!project) {
            res.status(404).json({ success: false, error: "Project not found" });
            return;
        }
        // Detect stale running workflow (over 5 minutes without update = process interrupted by server restart)
        const STALE_THRESHOLD_MS = 5 * 60 * 1000;
        const isStale = project.status === "running" &&
            Date.now() - new Date(project.updatedAt).getTime() > STALE_THRESHOLD_MS;
        if (isStale) {
            await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId: id }, {
                status: "failed",
                lastError: "Workflow timed out or interrupted due to server restart.",
            });
            project.status = "failed";
            project.lastError = "Workflow timed out or interrupted due to server restart.";
        }
        res.json({
            success: true,
            data: {
                projectId: project.projectId,
                status: project.status,
                lastError: project.lastError || null,
                executionErrors: project.executionErrors || [],
                usage: project.usage,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function startHackathon(req, res) {
    try {
        const id = getProjectId(req);
        const project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
        if (!project) {
            res.status(404).json({ success: false, error: "Project not found" });
            return;
        }
        const STALE_THRESHOLD_MS = 5 * 60 * 1000;
        const isStale = project.status === "running" &&
            Date.now() - new Date(project.updatedAt).getTime() > STALE_THRESHOLD_MS;
        if (project.status === "running" && !isStale) {
            res.status(409).json({ success: false, error: "Workflow already running" });
            return;
        }
        // Update status to running
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId: id }, { status: "running", lastError: "", executionErrors: [] });
        // Build initial state
        const initialState = (0, state_1.createInitialState)(id, {
            problemStatement: project.problemStatement,
            hackathon: project.hackathon,
            userConstraints: project.userConstraints,
            teamSize: project.teamSize,
            resumes: project.resumes || [],
            githubLinks: project.githubLinks || [],
        });
        // Run workflow asynchronously
        runWorkflowAsync(id, initialState).catch((err) => {
            console.error(`[WORKFLOW] Failed for ${id}:`, err);
        });
        res.json({
            success: true,
            data: { projectId: id, status: "running" },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function runWorkflowAsync(projectId, initialState) {
    try {
        const result = (await hackforgeGraph_1.hackforgeGraph.invoke(initialState));
        const lastErr = result.errors && result.errors.length > 0
            ? result.errors[result.errors.length - 1].error
            : "";
        // Persist the full workflow state so it can be resumed after user selection
        const stateToSave = {
            projectId: result.projectId,
            input: result.input,
            problemAnalysis: result.problemAnalysis,
            research: result.research,
            innovation: result.innovation,
            teamAnalysis: result.teamAnalysis,
            status: result.status,
            errors: result.errors,
            usage: result.usage,
        };
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId }, {
            status: result.status,
            lastError: lastErr,
            executionErrors: result.errors || [],
            workflowState: stateToSave,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error in graph execution";
        console.error(`[WORKFLOW] Error for ${projectId}:`, error);
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId }, {
            status: "failed",
            lastError: errorMessage,
            executionErrors: [
                {
                    agent: "system",
                    node: "graphInvocation",
                    error: errorMessage,
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
function streamEvents(req, res) {
    const id = getProjectId(req);
    const cleanup = (0, sseStreamer_1.registerSSEConnection)(id, res);
    req.on("close", () => {
        cleanup();
    });
}
async function getProblemAnalysis(req, res) {
    try {
        const id = getProjectId(req);
        const { ProblemAnalysisRecord } = await Promise.resolve().then(() => __importStar(require("../models/ProblemAnalysis.model")));
        const record = await ProblemAnalysisRecord.findOne({ projectId: id })
            .sort({ version: -1 })
            .lean();
        if (!record) {
            res.status(404).json({
                success: false,
                error: "Problem analysis not found",
            });
            return;
        }
        res.json({
            success: true,
            data: {
                projectId: id,
                version: record.version,
                analysis: record.output,
                createdAt: record.createdAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function getResearchResult(req, res) {
    try {
        const id = getProjectId(req);
        const { ResearchRun } = await Promise.resolve().then(() => __importStar(require("../models/ResearchRun.model")));
        const record = await ResearchRun.findOne({ projectId: id })
            .sort({ createdAt: -1 })
            .lean();
        if (!record) {
            // Check if project exists and is running
            const project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
            if (project) {
                res.json({
                    success: true,
                    data: {
                        projectId: id,
                        status: project.status,
                        message: project.status === "running" ? "Research agent is currently executing..." : "No research run recorded yet.",
                    },
                });
                return;
            }
            res.status(404).json({
                success: false,
                error: "Project not found",
            });
            return;
        }
        if (!record.result) {
            res.json({
                success: true,
                data: {
                    projectId: id,
                    researchId: record.researchId,
                    status: record.status,
                    message: record.status === "running" ? "Research agent is currently executing discovery & enrichment..." : "Research ended without final payload.",
                    metrics: record.metrics,
                    error: record.error || null,
                },
            });
            return;
        }
        res.json({
            success: true,
            data: {
                projectId: id,
                researchId: record.researchId,
                status: record.status,
                result: record.result,
                metrics: record.metrics,
                startedAt: record.startedAt,
                completedAt: record.completedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function getInnovationResult(req, res) {
    try {
        const id = getProjectId(req);
        const record = await InnovationResult_model_1.InnovationResultModel.findOne({ projectId: id })
            .sort({ createdAt: -1 })
            .lean();
        if (!record) {
            res.status(404).json({
                success: false,
                error: "Innovation result not found",
            });
            return;
        }
        res.json({
            success: true,
            data: {
                projectId: id,
                innovationId: record.innovationId,
                status: record.status,
                candidateCount: record.candidateCount,
                selectedCandidateId: record.selectedCandidateId || null,
                result: record.result || null,
                startedAt: record.startedAt,
                completedAt: record.completedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function selectCandidateHandler(req, res) {
    try {
        const id = getProjectId(req);
        const { candidateId } = req.body;
        if (!candidateId || typeof candidateId !== "string") {
            res.status(400).json({ success: false, error: "candidateId is required" });
            return;
        }
        // Find the latest innovation result for this project
        const record = await InnovationResult_model_1.InnovationResultModel.findOne({ projectId: id })
            .sort({ createdAt: -1 })
            .lean();
        if (!record || !record.result) {
            res.status(404).json({
                success: false,
                error: "No innovation result found for this project",
            });
            return;
        }
        // Validate candidate exists
        const innovation = record.result;
        const candidate = innovation.candidateIdeas?.find((c) => c.id === candidateId);
        if (!candidate) {
            res.status(404).json({
                success: false,
                error: `Candidate with id "${candidateId}" not found`,
            });
            return;
        }
        // Persist selection in innovation result
        await (0, InnovationResult_model_1.selectCandidate)(id, candidateId);
        // Load the persisted workflow state
        const project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
        if (!project || !project.workflowState) {
            res.status(400).json({
                success: false,
                error: "No workflow state found. Workflow may not have completed Phase 1.",
            });
            return;
        }
        // Reconstruct state with selected candidate (full CandidateIdea object, not just ID)
        const currentState = project.workflowState;
        currentState.innovation = currentState.innovation || {};
        currentState.innovation.selectedIdea = candidate;
        // Update project status to running (teamArchitect is executing)
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId: id }, { status: "running", lastError: "", executionErrors: [] });
        // Emit SSE event: resuming
        const { emitEvent } = await Promise.resolve().then(() => __importStar(require("../utils/sseStreamer")));
        emitEvent(id, "teamArchitect", "agent_started", `Resuming workflow — Team Architect processing candidate "${candidate.name}"`);
        // Resume Phase 2 asynchronously: run teamArchitect
        resumePhase2Async(id, currentState).catch((err) => {
            console.error(`[WORKFLOW] Phase 2 resume failed for ${id}:`, err);
        });
        res.json({
            success: true,
            data: {
                projectId: id,
                selectedCandidateId: candidateId,
                candidateName: candidate.name,
                oneLineDescription: candidate.oneLineDescription,
                message: "Candidate selected. Team Architect is now executing...",
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function resumePhase2Async(projectId, currentState) {
    try {
        const result = await (0, hackforgeGraph_1.resumeAfterCandidateSelection)(projectId, currentState);
        const lastErr = result.errors && result.errors.length > 0
            ? result.errors[result.errors.length - 1].error
            : "";
        // Persist the updated workflow state and team analysis
        const stateToSave = {
            projectId: result.projectId,
            input: result.input,
            problemAnalysis: result.problemAnalysis,
            research: result.research,
            innovation: result.innovation,
            teamAnalysis: result.teamAnalysis,
            status: result.status,
            errors: result.errors,
            usage: result.usage,
        };
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId }, {
            status: result.status || "completed",
            lastError: lastErr,
            executionErrors: result.errors || [],
            workflowState: stateToSave,
        });
        // Persist team analysis to its own collection
        const { persistTeamAnalysis } = await Promise.resolve().then(() => __importStar(require("../models/TeamAnalysis.model")));
        if (result.teamAnalysis) {
            await persistTeamAnalysis(projectId, result.teamAnalysis);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error in Phase 2";
        console.error(`[WORKFLOW] Phase 2 error for ${projectId}:`, error);
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId }, {
            status: "failed",
            lastError: errorMessage,
            executionErrors: [
                {
                    agent: "teamArchitect",
                    node: "resumePhase2",
                    error: errorMessage,
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
async function getTeamAnalysis(req, res) {
    try {
        const id = getProjectId(req);
        const record = await (0, TeamAnalysis_model_1.getTeamAnalysis)(id);
        if (!record) {
            const project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
            if (project) {
                res.json({
                    success: true,
                    data: {
                        projectId: id,
                        status: project.status,
                        message: project.status === "running"
                            ? "Team Architect agent is currently executing..."
                            : "No team analysis recorded yet.",
                    },
                });
                return;
            }
            res.status(404).json({
                success: false,
                error: "Project not found",
            });
            return;
        }
        if (!record.result) {
            res.json({
                success: true,
                data: {
                    projectId: id,
                    teamAnalysisId: record.teamAnalysisId,
                    status: record.status,
                    message: record.status === "running"
                        ? "Team analysis is currently executing..."
                        : "Team analysis ended without final payload.",
                    error: record.error || null,
                },
            });
            return;
        }
        res.json({
            success: true,
            data: {
                projectId: id,
                teamAnalysisId: record.teamAnalysisId,
                status: record.status,
                teamMemberCount: record.teamMemberCount,
                feasibilityScore: record.feasibilityScore,
                techStackOptionCount: record.techStackOptionCount,
                selectedTechStackId: record.selectedTechStackId || null,
                result: record.result,
                startedAt: record.startedAt,
                completedAt: record.completedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function selectTechStackHandler(req, res) {
    try {
        const id = getProjectId(req);
        const { optionId } = req.body;
        if (!optionId || typeof optionId !== "string") {
            res.status(400).json({ success: false, error: "optionId is required" });
            return;
        }
        const record = await (0, TeamAnalysis_model_1.selectTechStack)(id, optionId);
        if (!record || !record.result) {
            res.status(404).json({
                success: false,
                error: "No team analysis found for this project",
            });
            return;
        }
        const teamAnalysis = record.result;
        const selectedOption = teamAnalysis.techStackOptions?.find((opt) => opt.optionId === optionId);
        // Load the persisted workflow state
        const project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
        if (!project || !project.workflowState) {
            res.status(400).json({
                success: false,
                error: "No workflow state found. Workflow may not have completed earlier phases.",
            });
            return;
        }
        // Reconstruct state with selected tech stack
        const currentState = project.workflowState;
        currentState.teamAnalysis = currentState.teamAnalysis || {};
        currentState.teamAnalysis.selectedTechStack = selectedOption;
        // Update project status to running (CTO agent is executing)
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId: id }, { status: "running", lastError: "", executionErrors: [] });
        // Emit SSE event: resuming
        const { emitEvent } = await Promise.resolve().then(() => __importStar(require("../utils/sseStreamer")));
        emitEvent(id, "cto", "agent_started", `Resuming workflow — CTO Agent generating architecture with "${selectedOption?.name || optionId}" tech stack`);
        // Resume Phase 3 asynchronously: run CTO agent
        resumePhase3Async(id, currentState).catch((err) => {
            console.error(`[WORKFLOW] Phase 3 resume failed for ${id}:`, err);
        });
        res.json({
            success: true,
            data: {
                projectId: id,
                selectedOptionId: optionId,
                optionName: selectedOption?.name || "Unknown",
                message: "Tech stack selected. CTO Agent is now generating the system architecture...",
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
async function resumePhase3Async(projectId, currentState) {
    try {
        const result = await (0, hackforgeGraph_1.resumeAfterTechStackSelection)(projectId, currentState);
        const lastErr = result.errors && result.errors.length > 0
            ? result.errors[result.errors.length - 1].error
            : "";
        // Persist the updated workflow state and architecture
        const stateToSave = {
            projectId: result.projectId,
            input: result.input,
            problemAnalysis: result.problemAnalysis,
            research: result.research,
            innovation: result.innovation,
            teamAnalysis: result.teamAnalysis,
            architecture: result.architecture,
            status: result.status,
            errors: result.errors,
            usage: result.usage,
        };
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId }, {
            status: result.status || "completed",
            lastError: lastErr,
            executionErrors: result.errors || [],
            workflowState: stateToSave,
        });
        // Persist architecture to its own collection
        const { persistArchitectureResult } = await Promise.resolve().then(() => __importStar(require("../models/ArchitectureResult.model")));
        if (result.architecture) {
            await persistArchitectureResult(projectId, result.architecture);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error in Phase 3";
        console.error(`[WORKFLOW] Phase 3 error for ${projectId}:`, error);
        await HackathonProject_model_1.HackathonProject.findOneAndUpdate({ projectId }, {
            status: "failed",
            lastError: errorMessage,
            executionErrors: [
                {
                    agent: "cto",
                    node: "resumePhase3",
                    error: errorMessage,
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
async function getArchitectureResult(req, res) {
    try {
        const id = getProjectId(req);
        const record = await (0, ArchitectureResult_model_1.getArchitectureResult)(id);
        if (!record) {
            const project = await HackathonProject_model_1.HackathonProject.findOne({ projectId: id }).lean();
            if (project) {
                res.json({
                    success: true,
                    data: {
                        projectId: id,
                        status: project.status,
                        message: project.status === "running"
                            ? "CTO Agent is currently generating architecture..."
                            : "No architecture result recorded yet.",
                    },
                });
                return;
            }
            res.status(404).json({
                success: false,
                error: "Project not found",
            });
            return;
        }
        if (!record.result) {
            res.json({
                success: true,
                data: {
                    projectId: id,
                    architectureId: record.architectureId,
                    status: record.status,
                    message: record.status === "running"
                        ? "Architecture generation is currently executing..."
                        : "Architecture generation ended without final payload.",
                    error: record.error || null,
                },
            });
            return;
        }
        res.json({
            success: true,
            data: {
                projectId: id,
                architectureId: record.architectureId,
                status: record.status,
                componentCount: record.componentCount,
                collectionCount: record.collectionCount,
                endpointCount: record.endpointCount,
                confidence: record.confidence,
                selectedTechStackId: record.selectedTechStackId,
                result: record.result,
                startedAt: record.startedAt,
                completedAt: record.completedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
//# sourceMappingURL=hackathon.controller.js.map