"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCTO = runCTO;
const sseStreamer_1 = require("../../utils/sseStreamer");
const architectureGenerator_1 = require("./architectureGenerator");
const schemaContractGenerator_1 = require("./schemaContractGenerator");
const aiRagArchitect_1 = require("./aiRagArchitect");
const implementationPlanner_1 = require("./implementationPlanner");
const githubProfileAnalyzer_1 = require("./githubProfileAnalyzer");
async function runCTO(projectId, selectedIdea, teamAnalysis, hackathonParams, githubLinks) {
    (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", "CTO Agent starting architecture generation");
    try {
        const chosenTechStack = teamAnalysis.selectedTechStack;
        if (!chosenTechStack) {
            return {
                success: false,
                error: "No tech stack selected. User must select a tech stack first.",
            };
        }
        const hackathonDuration = hackathonParams?.durationHours || 36;
        const hackathonConstraints = [
            ...(hackathonParams?.rules || []),
            ...(hackathonParams?.restrictions || []),
        ].join("\n");
        // Step 0: Analyze GitHub profiles for enriched team capabilities
        let githubData = [];
        if (githubLinks && githubLinks.length > 0) {
            githubData = await (0, githubProfileAnalyzer_1.analyzeGithubProfiles)(projectId, githubLinks);
        }
        // Step 1: Generate Architecture Overview, Components, Data Flow
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", "Generating system architecture and component design");
        const archResult = await (0, architectureGenerator_1.generateArchitecture)(selectedIdea, teamAnalysis, chosenTechStack, hackathonDuration, hackathonConstraints);
        if (!archResult.success) {
            return {
                success: false,
                error: `Architecture generation failed: ${archResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", `Architecture generated: ${archResult.components?.length || 0} components, ${archResult.dataFlow?.length || 0} data flow steps`);
        // Step 2: Generate Database Schema & API Contracts
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", "Generating database schema and API contracts");
        const schemaResult = await (0, schemaContractGenerator_1.generateSchemaAndContracts)(archResult.architectureOverview, archResult.components || [], archResult.dataFlow || [], selectedIdea);
        if (!schemaResult.success) {
            return {
                success: false,
                error: `Schema/contract generation failed: ${schemaResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", `Schema generated: ${schemaResult.databaseSchema?.length || 0} collections, ${schemaResult.apiContracts?.length || 0} endpoints`);
        // Step 3: Generate AI & RAG Architecture (with GitHub-enriched capabilities)
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", "Generating AI pipeline and RAG architecture");
        const teamCapabilitiesText = buildTeamCapabilitiesText(teamAnalysis, githubData);
        const aiResult = await (0, aiRagArchitect_1.generateAiRagArchitecture)(archResult.architectureOverview, archResult.components || [], selectedIdea, teamCapabilitiesText);
        if (!aiResult.success) {
            return {
                success: false,
                error: `AI/RAG architecture generation failed: ${aiResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", `AI architecture: ${aiResult.aiArchitecture?.llmModels?.length || 0} models, ${aiResult.aiArchitecture?.prompts?.length || 0} prompts`);
        // Step 4: Generate Implementation Plan & Risks
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", "Generating implementation plan and risk assessment");
        const rolesText = teamAnalysis.roleAssignments
            .map((r) => `${r.roleTitle} → ${r.assignedMemberName} (${r.assignedCapabilities.join(", ")})`)
            .join("\n");
        const implResult = await (0, implementationPlanner_1.generateImplementationPlan)(archResult.architectureOverview, archResult.components || [], archResult.dataFlow || [], rolesText, hackathonDuration, hackathonConstraints);
        if (!implResult.success) {
            return {
                success: false,
                error: `Implementation plan generation failed: ${implResult.error}`,
            };
        }
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", `Implementation plan: ${implResult.implementationPlan?.length || 0} phases, ${implResult.risks?.length || 0} risks identified`);
        // Step 5: Assemble final ArchitectureResult
        const architectureResult = {
            architectureId: `arch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            projectId,
            selectedTechStack: {
                optionId: chosenTechStack.optionId,
                name: chosenTechStack.name,
                rationale: chosenTechStack.description,
                teamFitScore: chosenTechStack.teamFitScore,
                components: [
                    ...chosenTechStack.frontend,
                    ...chosenTechStack.backend,
                    ...chosenTechStack.database,
                    ...chosenTechStack.aiMl,
                ],
            },
            architectureOverview: archResult.architectureOverview,
            components: archResult.components || [],
            dataFlow: archResult.dataFlow || [],
            databaseSchema: schemaResult.databaseSchema || [],
            apiContracts: schemaResult.apiContracts || [],
            aiArchitecture: aiResult.aiArchitecture,
            ragArchitecture: aiResult.ragArchitecture || undefined,
            externalServices: extractExternalServices(aiResult.aiArchitecture),
            risks: implResult.risks || [],
            implementationPlan: implResult.implementationPlan || [],
            hackathonTimeline: implResult.hackathonTimeline || {
                totalHours: hackathonDuration,
                phases: [],
            },
            confidence: calculateConfidence(archResult, schemaResult, aiResult, implResult),
            estimatedDemoReadiness: estimateDemoReadiness(implResult, hackathonDuration),
        };
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_completed", `Architecture complete: ${architectureResult.components.length} components, ${architectureResult.databaseSchema.length} collections, ${architectureResult.apiContracts.length} endpoints, confidence ${architectureResult.confidence}`);
        return { success: true, architecture: architectureResult };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "CTO Agent failed";
        console.error("[CTO] Fatal error:", err);
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_failed", msg);
        return { success: false, error: msg };
    }
}
function buildTeamCapabilitiesText(teamAnalysis, githubData) {
    const lines = [];
    // Base team capabilities from resume parsing
    for (const m of teamAnalysis.teamMembers) {
        lines.push(`${m.name} (${m.primaryRole}): ${m.parsedSkills.join(", ")}`);
    }
    // Enrich with GitHub data
    if (githubData.length > 0) {
        lines.push("\n--- GitHub Profile Analysis ---");
        for (const gh of githubData) {
            const roleHint = gh.role ? ` [${gh.role}]` : "";
            lines.push(`${gh.displayName} (@${gh.username})${roleHint}:`);
            lines.push(`  Profile: ${gh.githubProfileUrl}`);
            lines.push(`  Languages: ${gh.topLanguages.join(", ") || "N/A"}`);
            lines.push(`  Skills from repos: ${gh.skillsFromRepos.join(", ") || "N/A"}`);
            if (gh.topRepositories.length > 0) {
                lines.push(`  Notable repos: ${gh.topRepositories.slice(0, 3).map((r) => `${r.name} (${r.language}, ${r.stars}★)`).join(", ")}`);
            }
            lines.push(`  Bio: ${gh.bio || "N/A"}`);
        }
    }
    return lines.join("\n");
}
function extractExternalServices(aiArchitecture) {
    const services = [];
    if (aiArchitecture?.llmModels) {
        for (const model of aiArchitecture.llmModels) {
            services.push({
                name: `${model.provider} ${model.model}`,
                purpose: model.purpose,
                authMethod: "API Key",
                rateLimit: "Varies by provider",
                fallbackStrategy: "Switch to alternative model or disable AI feature",
                costTier: model.provider === "google" ? "low" : "medium",
            });
        }
    }
    if (aiArchitecture?.agentTools) {
        for (const tool of aiArchitecture.agentTools) {
            if (tool.integration && tool.integration !== "internal") {
                services.push({
                    name: tool.name,
                    purpose: tool.purpose,
                    authMethod: "API Key",
                    fallbackStrategy: "Disable tool, use cached/mock data",
                    costTier: "low",
                });
            }
        }
    }
    return services;
}
function calculateConfidence(archResult, schemaResult, aiResult, implResult) {
    let confidence = 0.5;
    if (archResult.components && archResult.components.length >= 3)
        confidence += 0.1;
    if (archResult.dataFlow && archResult.dataFlow.length >= 3)
        confidence += 0.05;
    if (schemaResult.databaseSchema && schemaResult.databaseSchema.length >= 1)
        confidence += 0.1;
    if (schemaResult.apiContracts && schemaResult.apiContracts.length >= 3)
        confidence += 0.05;
    if (aiResult.aiArchitecture?.llmModels?.length >= 1)
        confidence += 0.1;
    if (aiResult.aiArchitecture?.fallbackPolicies?.length >= 1)
        confidence += 0.05;
    if (implResult.implementationPlan && implResult.implementationPlan.length >= 2)
        confidence += 0.05;
    if (implResult.risks && implResult.risks.length >= 1)
        confidence += 0.05;
    return Math.min(confidence, 1);
}
function estimateDemoReadiness(implResult, hackathonDuration) {
    if (!implResult.implementationPlan)
        return "Unknown";
    const totalTasks = implResult.implementationPlan.reduce((sum, phase) => sum + (phase.tasks?.length || 0), 0);
    const estimatedHours = implResult.implementationPlan.reduce((sum, phase) => sum +
        (phase.tasks?.reduce((s, t) => s + (t.estimatedHours || 0), 0) || 0), 0);
    if (estimatedHours <= hackathonDuration * 0.7) {
        return "High — comfortable timeline with buffer for polish";
    }
    else if (estimatedHours <= hackathonDuration * 0.9) {
        return "Medium — tight but achievable with focused execution";
    }
    else {
        return "Low — may need to cut features or work overtime";
    }
}
//# sourceMappingURL=cto.agent.js.map