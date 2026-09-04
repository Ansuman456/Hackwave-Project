"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTeamArchitect = runTeamArchitect;
const sseStreamer_1 = require("../../utils/sseStreamer");
const resumeParser_1 = require("./resumeParser");
const roleMatcher_1 = require("./roleMatcher");
const feasibilityAnalyzer_1 = require("./feasibilityAnalyzer");
const techStackGenerator_1 = require("./techStackGenerator");
async function runTeamArchitect(projectId, problemAnalysis, research, innovation, resumes) {
    (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", "Team Architect agent starting analysis");
    try {
        const selectedIdea = innovation.selectedIdea;
        if (!selectedIdea) {
            return {
                success: false,
                error: "No selected idea found. User must select a candidate first.",
            };
        }
        const projectRequirements = innovation.projectCapabilityRequirements;
        // Step 1: Parse resumes
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", "Parsing team resumes and extracting skills");
        let teamMembers;
        if (resumes.length === 0) {
            // Create synthetic profile from teamSize
            teamMembers = createSyntheticProfiles(innovation.projectCapabilityRequirements.likelyTeamRoles.length || 3);
            (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", `No resumes provided. Created ${teamMembers.length} synthetic profiles.`);
        }
        else {
            const parseResult = await (0, resumeParser_1.parseResumes)(resumes);
            if (!parseResult.success || !parseResult.members) {
                return {
                    success: false,
                    error: `Resume parsing failed: ${parseResult.error}`,
                };
            }
            teamMembers = parseResult.members;
        }
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", `Extracted skills from ${teamMembers.length} team members`);
        // Step 2: Feasibility Analysis (expands solution + checks data + feasibility)
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", "Analyzing feasibility and expanding solution details");
        const feasibilityResult = await (0, feasibilityAnalyzer_1.analyzeFeasibility)(selectedIdea, teamMembers, projectRequirements, problemAnalysis.constraints.find((c) => c.category === "time")?.description
            ? undefined
            : undefined, undefined);
        if (!feasibilityResult.success) {
            return {
                success: false,
                error: `Feasibility analysis failed: ${feasibilityResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", `Feasibility score: ${feasibilityResult.feasibility?.score}/10`);
        // Step 3: Role Assignment & Gap Detection
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", "Assigning roles and detecting skill gaps");
        const expandedSolutionText = feasibilityResult.expandedSolution
            ? `${feasibilityResult.expandedSolution.name}: ${feasibilityResult.expandedSolution.description}\nFeatures: ${feasibilityResult.expandedSolution.keyFeatures.join(", ")}\nCapabilities: ${feasibilityResult.expandedSolution.requiredCapabilities.join(", ")}`
            : selectedIdea.detailedDescription || selectedIdea.oneLineDescription;
        const roleResult = await (0, roleMatcher_1.matchRoles)(teamMembers, expandedSolutionText, undefined);
        if (!roleResult.success) {
            return {
                success: false,
                error: `Role assignment failed: ${roleResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", `Assigned ${roleResult.roleAssignments?.length || 0} roles, found ${roleResult.skillGaps?.length || 0} skill gaps`);
        // Step 4: Tech Stack Generation
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", "Generating technology stack options");
        const feasibilitySummary = feasibilityResult.feasibility
            ? `Score: ${feasibilityResult.feasibility.score}/10. ${feasibilityResult.feasibility.summary}\nStrengths: ${feasibilityResult.feasibility.teamStrengths.join(", ")}\nWeaknesses: ${feasibilityResult.feasibility.teamWeaknesses.join(", ")}`
            : "Feasibility assessment not available.";
        const techResult = await (0, techStackGenerator_1.generateTechStacks)(expandedSolutionText, teamMembers, feasibilitySummary, projectRequirements, undefined, problemAnalysis.constraints
            .filter((c) => c.description.toLowerCase().includes("forbidden"))
            .map((c) => c.description));
        if (!techResult.success) {
            return {
                success: false,
                error: `Tech stack generation failed: ${techResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_started", `Generated ${techResult.techStackOptions?.length || 0} tech stack options`);
        // Step 5: Build TeamAnalysis result
        const teamAnalysis = {
            teamMembers,
            roleAssignments: roleResult.roleAssignments || [],
            skillGaps: roleResult.skillGaps || [],
            dataAvailability: feasibilityResult.dataAvailability || [],
            expandedSolution: feasibilityResult.expandedSolution || {
                name: selectedIdea.name,
                description: selectedIdea.oneLineDescription,
                problemSolved: selectedIdea.problemSolved,
                targetUsers: selectedIdea.targetUsers,
                keyFeatures: selectedIdea.keyFeatures.map((f) => f.name),
                workflow: selectedIdea.workflow.map((w) => w.action),
                requiredCapabilities: projectRequirements.requiredCapabilities,
                technicalCapabilities: projectRequirements.technicalCapabilities,
                complexityAreas: projectRequirements.complexityAreas,
            },
            feasibility: feasibilityResult.feasibility || {
                score: 5,
                summary: "Feasibility assessment incomplete",
                teamStrengths: [],
                teamWeaknesses: [],
                timeRisk: "medium",
                technicalRisk: "medium",
                dataRisk: "medium",
                recommendations: [],
            },
            techStackOptions: techResult.techStackOptions || [],
            selectedTechStack: null, // User will select
            overallTeamStrategy: roleResult.overallTeamStrategy ||
                "Team analysis completed with available data.",
        };
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_completed", `Team analysis complete: ${teamMembers.length} members, ${teamAnalysis.techStackOptions.length} tech options, feasibility: ${teamAnalysis.feasibility.score}/10`);
        return { success: true, teamAnalysis };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Team Architect agent failed";
        console.error("[TeamArchitect] Fatal error:", err);
        (0, sseStreamer_1.emitEvent)(projectId, "teamArchitect", "agent_failed", msg);
        return { success: false, error: msg };
    }
}
function createSyntheticProfiles(count) {
    const roles = [
        "Fullstack Engineer",
        "Frontend Developer",
        "Backend Developer",
        "ML Engineer",
        "DevOps Engineer",
    ];
    return Array.from({ length: count }, (_, i) => ({
        memberId: `member_${i + 1}`,
        name: `Team Member ${i + 1}`,
        parsedSkills: [],
        primaryRole: roles[i % roles.length],
        proficiencyLevels: {},
        resumeSnippet: "No resume provided. Profile created from team size.",
    }));
}
//# sourceMappingURL=team.agent.js.map