import {
  TeamAnalysis,
  ArchitectureResult,
} from "../../graph/state";
import { emitEvent } from "../../utils/sseStreamer";
import { generateArchitecture } from "./architectureGenerator";
import { generateSchemaAndContracts } from "./schemaContractGenerator";
import { generateAiRagArchitecture } from "./aiRagArchitect";
import { generateImplementationPlan } from "./implementationPlanner";
import { analyzeGithubProfiles, GithubProfileData } from "./githubProfileAnalyzer";

export interface CTOResult {
  success: boolean;
  architecture?: ArchitectureResult;
  error?: string;
}

export async function runCTO(
  projectId: string,
  selectedIdea: any,
  teamAnalysis: TeamAnalysis,
  hackathonParams?: {
    durationHours?: number;
    rules?: string[];
    restrictions?: string[];
  },
  githubLinks?: Array<{ githubProfileUrl: string; username: string; role?: string }>
): Promise<CTOResult> {
  emitEvent(
    projectId,
    "cto",
    "agent_started",
    "CTO Agent starting architecture generation"
  );

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
    let githubData: GithubProfileData[] = [];
    if (githubLinks && githubLinks.length > 0) {
      githubData = await analyzeGithubProfiles(projectId, githubLinks);
    }

    // Step 1: Generate Architecture Overview, Components, Data Flow
    emitEvent(
      projectId,
      "cto",
      "agent_started",
      "Generating system architecture and component design"
    );

    const archResult = await generateArchitecture(
      selectedIdea,
      teamAnalysis,
      chosenTechStack,
      hackathonDuration,
      hackathonConstraints
    );

    if (!archResult.success) {
      return {
        success: false,
        error: `Architecture generation failed: ${archResult.error}`,
      };
    }

    emitEvent(
      projectId,
      "cto",
      "agent_started",
      `Architecture generated: ${archResult.components?.length || 0} components, ${archResult.dataFlow?.length || 0} data flow steps`
    );

    // Step 2: Generate Database Schema & API Contracts
    emitEvent(
      projectId,
      "cto",
      "agent_started",
      "Generating database schema and API contracts"
    );

    const schemaResult = await generateSchemaAndContracts(
      archResult.architectureOverview!,
      archResult.components || [],
      archResult.dataFlow || [],
      selectedIdea
    );

    if (!schemaResult.success) {
      return {
        success: false,
        error: `Schema/contract generation failed: ${schemaResult.error}`,
      };
    }

    emitEvent(
      projectId,
      "cto",
      "agent_started",
      `Schema generated: ${schemaResult.databaseSchema?.length || 0} collections, ${schemaResult.apiContracts?.length || 0} endpoints`
    );

    // Step 3: Generate AI & RAG Architecture (with GitHub-enriched capabilities)
    emitEvent(
      projectId,
      "cto",
      "agent_started",
      "Generating AI pipeline and RAG architecture"
    );

    const teamCapabilitiesText = buildTeamCapabilitiesText(
      teamAnalysis,
      githubData
    );

    const aiResult = await generateAiRagArchitecture(
      archResult.architectureOverview!,
      archResult.components || [],
      selectedIdea,
      teamCapabilitiesText
    );

    if (!aiResult.success) {
      return {
        success: false,
        error: `AI/RAG architecture generation failed: ${aiResult.error}`,
      };
    }

    emitEvent(
      projectId,
      "cto",
      "agent_started",
      `AI architecture: ${aiResult.aiArchitecture?.llmModels?.length || 0} models, ${aiResult.aiArchitecture?.prompts?.length || 0} prompts`
    );

    // Step 4: Generate Implementation Plan & Risks
    emitEvent(
      projectId,
      "cto",
      "agent_started",
      "Generating implementation plan and risk assessment"
    );

    const rolesText = teamAnalysis.roleAssignments
      .map(
        (r) =>
          `${r.roleTitle} → ${r.assignedMemberName} (${r.assignedCapabilities.join(", ")})`
      )
      .join("\n");

    const implResult = await generateImplementationPlan(
      archResult.architectureOverview!,
      archResult.components || [],
      archResult.dataFlow || [],
      rolesText,
      hackathonDuration,
      hackathonConstraints
    );

    if (!implResult.success) {
      return {
        success: false,
        error: `Implementation plan generation failed: ${implResult.error}`,
      };
    }

    emitEvent(
      projectId,
      "cto",
      "agent_started",
      `Implementation plan: ${implResult.implementationPlan?.length || 0} phases, ${implResult.risks?.length || 0} risks identified`
    );

    // Step 5: Assemble final ArchitectureResult
    const architectureResult: ArchitectureResult = {
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
      architectureOverview: archResult.architectureOverview!,
      components: archResult.components || [],
      dataFlow: archResult.dataFlow || [],
      databaseSchema: schemaResult.databaseSchema || [],
      apiContracts: schemaResult.apiContracts || [],
      aiArchitecture: aiResult.aiArchitecture!,
      ragArchitecture: aiResult.ragArchitecture || undefined,
      externalServices: extractExternalServices(aiResult.aiArchitecture!),
      risks: implResult.risks || [],
      implementationPlan: implResult.implementationPlan || [],
      hackathonTimeline: implResult.hackathonTimeline || {
        totalHours: hackathonDuration,
        phases: [],
      },
      confidence: calculateConfidence(archResult, schemaResult, aiResult, implResult),
      estimatedDemoReadiness: estimateDemoReadiness(implResult, hackathonDuration),
    };

    emitEvent(
      projectId,
      "cto",
      "agent_completed",
      `Architecture complete: ${architectureResult.components.length} components, ${architectureResult.databaseSchema.length} collections, ${architectureResult.apiContracts.length} endpoints, confidence ${architectureResult.confidence}`
    );

    return { success: true, architecture: architectureResult };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "CTO Agent failed";
    console.error("[CTO] Fatal error:", err);
    emitEvent(projectId, "cto", "agent_failed", msg);
    return { success: false, error: msg };
  }
}

function buildTeamCapabilitiesText(
  teamAnalysis: TeamAnalysis,
  githubData: GithubProfileData[]
): string {
  const lines: string[] = [];

  // Base team capabilities from resume parsing
  for (const m of teamAnalysis.teamMembers) {
    lines.push(
      `${m.name} (${m.primaryRole}): ${m.parsedSkills.join(", ")}`
    );
  }

  // Enrich with GitHub data
  if (githubData.length > 0) {
    lines.push("\n--- GitHub Profile Analysis ---");
    for (const gh of githubData) {
      const roleHint = gh.role ? ` [${gh.role}]` : "";
      lines.push(
        `${gh.displayName} (@${gh.username})${roleHint}:`
      );
      lines.push(
        `  Profile: ${gh.githubProfileUrl}`
      );
      lines.push(
        `  Languages: ${gh.topLanguages.join(", ") || "N/A"}`
      );
      lines.push(
        `  Skills from repos: ${gh.skillsFromRepos.join(", ") || "N/A"}`
      );
      if (gh.topRepositories.length > 0) {
        lines.push(
          `  Notable repos: ${gh.topRepositories.slice(0, 3).map((r) => `${r.name} (${r.language}, ${r.stars}★)`).join(", ")}`
        );
      }
      lines.push(`  Bio: ${gh.bio || "N/A"}`);
    }
  }

  return lines.join("\n");
}

function extractExternalServices(aiArchitecture: any): any[] {
  const services: any[] = [];

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

function calculateConfidence(
  archResult: any,
  schemaResult: any,
  aiResult: any,
  implResult: any
): number {
  let confidence = 0.5;

  if (archResult.components && archResult.components.length >= 3) confidence += 0.1;
  if (archResult.dataFlow && archResult.dataFlow.length >= 3) confidence += 0.05;

  if (schemaResult.databaseSchema && schemaResult.databaseSchema.length >= 1) confidence += 0.1;
  if (schemaResult.apiContracts && schemaResult.apiContracts.length >= 3) confidence += 0.05;

  if (aiResult.aiArchitecture?.llmModels?.length >= 1) confidence += 0.1;
  if (aiResult.aiArchitecture?.fallbackPolicies?.length >= 1) confidence += 0.05;

  if (implResult.implementationPlan && implResult.implementationPlan.length >= 2) confidence += 0.05;
  if (implResult.risks && implResult.risks.length >= 1) confidence += 0.05;

  return Math.min(confidence, 1);
}

function estimateDemoReadiness(implResult: any, hackathonDuration: number): string {
  if (!implResult.implementationPlan) return "Unknown";

  const totalTasks = implResult.implementationPlan.reduce(
    (sum: number, phase: any) => sum + (phase.tasks?.length || 0),
    0
  );

  const estimatedHours = implResult.implementationPlan.reduce(
    (sum: number, phase: any) =>
      sum +
      (phase.tasks?.reduce((s: number, t: any) => s + (t.estimatedHours || 0), 0) || 0),
    0
  );

  if (estimatedHours <= hackathonDuration * 0.7) {
    return "High — comfortable timeline with buffer for polish";
  } else if (estimatedHours <= hackathonDuration * 0.9) {
    return "Medium — tight but achievable with focused execution";
  } else {
    return "Low — may need to cut features or work overtime";
  }
}
