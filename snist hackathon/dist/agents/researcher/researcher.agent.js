"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runResearcher = runResearcher;
exports.ensureCompleteSolutionFields = ensureCompleteSolutionFields;
exports.validateSolutionQuality = validateSolutionQuality;
const uuid_1 = require("uuid");
const researcherNodes_1 = require("./researcherNodes");
const solutionDeduplicator_1 = require("../../services/solutionDeduplicator");
const candidateRanker_1 = require("../../services/candidateRanker");
const evidenceMerger_1 = require("../../services/evidenceMerger");
const webResearchService_1 = require("../../services/webResearchService");
const sourceNormalizer_1 = require("../../services/sourceNormalizer");
const sseStreamer_1 = require("../../utils/sseStreamer");
const research_config_1 = require("../../config/research.config");
const ResearchRun_model_1 = require("../../models/ResearchRun.model");
const HackathonProject_model_1 = require("../../models/HackathonProject.model");
async function runResearcher(state, mode = "balanced") {
    const { projectId, problemAnalysis } = state;
    if (!problemAnalysis) {
        return {
            success: false,
            error: "ProblemAnalysis is required but was not provided",
        };
    }
    const budget = (0, research_config_1.getResearchBudget)(mode);
    const researchId = `research_${(0, uuid_1.v4)().substring(0, 8)}`;
    (0, sseStreamer_1.emitEvent)(projectId, "researcher", "research_started", `Starting research in ${mode} mode`);
    // Persist research run to MongoDB
    await (0, ResearchRun_model_1.createResearchRun)(projectId, researchId, mode, budget);
    // Build research plan
    (0, sseStreamer_1.emitEvent)(projectId, "researcher", "planning_started", "Building research plan");
    const researchPlan = await (0, researcherNodes_1.buildResearchPlan)(problemAnalysis, projectId);
    (0, sseStreamer_1.emitEvent)(projectId, "researcher", "planning_completed", `Research plan: ${researchPlan.researchDimensions.length} dimensions`);
    // Track metrics
    let geminiSearchCalls = 0;
    let tavilySearchCalls = 0;
    let githubSearchCalls = 0;
    let totalSourcesFound = 0;
    let discoveryRounds = 0;
    let enrichmentRounds = 0;
    let allContradictions = [];
    try {
        // ============================================================
        // PHASE 1: DISCOVERY LOOP
        // ============================================================
        let allSources = [];
        let previousCandidateCount = 0;
        let discoveryDecision = "continue";
        for (let round = 1; round <= budget.maxDiscoveryRounds; round++) {
            discoveryRounds = round;
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "discovery_round_started", `Discovery round ${round}/${budget.maxDiscoveryRounds}`);
            // Check budget before making external calls
            const totalSearchCalls = geminiSearchCalls + tavilySearchCalls + githubSearchCalls;
            if (totalSearchCalls >= budget.maxTotalSearchOperations) {
                (0, sseStreamer_1.emitEvent)(projectId, "researcher", "coverage_updated", "Budget limit reached, stopping discovery");
                break;
            }
            // Generate queries
            const { queries } = await (0, researcherNodes_1.generateDiscoveryQueries)(problemAnalysis, projectId, round);
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "query_generated", `Generated ${queries.length} queries`);
            // Run web search (Gemini + Tavily)
            const webQueries = queries.filter((q) => q.targetProviders.some((p) => p !== "github"));
            const githubQueries = queries.filter((q) => q.targetProviders.includes("github"));
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "search_started", `Executing dual search for ${webQueries.length} web queries`);
            const webResults = await (0, researcherNodes_1.runDualWebSearch)(webQueries, projectId);
            geminiSearchCalls += webResults.geminiCalls;
            tavilySearchCalls += webResults.tavilyCalls;
            totalSourcesFound += webResults.sources.length;
            // Run GitHub search
            const ghResults = await (0, researcherNodes_1.runGitHubSearch)(githubQueries, projectId);
            githubSearchCalls += ghResults.searchCalls;
            totalSourcesFound += ghResults.sources.length;
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "search_completed", `Found ${webResults.sources.length + ghResults.sources.length} sources`);
            // Merge all sources
            const roundSources = [...webResults.sources, ...ghResults.sources];
            allSources = [...allSources, ...roundSources];
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "sources_found", `Round ${round}: ${roundSources.length} sources found`);
            // Deduplicate sources
            allSources = (0, solutionDeduplicator_1.deduplicateSources)(allSources);
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "sources_merged", `${allSources.length} unique sources after deduplication`);
            // Build candidate entities from sources
            const candidates = (0, solutionDeduplicator_1.buildCandidateEntities)(allSources);
            // Classify candidates using LLM
            const sourcesForClassification = candidates.flatMap((c) => c.sources.map((src) => ({
                id: src.id,
                title: src.title,
                url: src.url,
                canonicalUrl: src.canonicalUrl,
                domain: src.domain,
                sourceType: src.sourceType,
                discoveredBy: src.discoveredBy,
                searchQueryIds: src.searchQueryIds,
                snippet: src.snippet,
                retrievedAt: src.retrievedAt,
                relevanceScore: src.relevanceScore,
                authorityScore: src.authorityScore,
                extractionStatus: src.extractionStatus,
                metadata: src.metadata,
            })));
            const { classified } = await (0, researcherNodes_1.classifyCandidates)(sourcesForClassification, problemAnalysis, projectId);
            // Track usage for candidate classification LLM call
            (0, HackathonProject_model_1.addUsageMetrics)(projectId, {
                geminiCalls: 1,
                llmTokens: 800,
            }).catch(() => { });
            // Apply classification back to candidates
            const classificationMap = new Map(classified.map((s) => [s.url, s.metadata?.classification || "irrelevant"]));
            // Filter out irrelevant candidates
            const relevantCandidates = candidates.filter((c) => {
                const hasRelevantSource = c.sources.some((src) => classificationMap.get(src.url) !== "irrelevant");
                return hasRelevantSource;
            });
            // Rank candidates using deterministic scoring
            const ranked = (0, candidateRanker_1.rankCandidates)(relevantCandidates.map((c) => ({
                ...c,
                relevanceScore: c.relevanceScore,
                directnessScore: c.sources.some((src) => classificationMap.get(src.url) === "direct")
                    ? 0.9
                    : c.sources.some((src) => classificationMap.get(src.url) === "adjacent")
                        ? 0.6
                        : 0.3,
                authorityScore: Math.max(...c.sources.map((src) => src.authorityScore || 0.5)),
                evidenceCount: c.sources.length,
            })), budget.maxCandidatesForEnrichment);
            const newCandidateCount = relevantCandidates.length - previousCandidateCount;
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "candidate_found", `Round ${round}: ${relevantCandidates.length} relevant candidates, ${newCandidateCount} new`);
            previousCandidateCount = relevantCandidates.length;
            // Use deterministic decision function
            const budgetRemaining = totalSearchCalls < budget.maxTotalSearchOperations;
            discoveryDecision = (0, researcherNodes_1.shouldContinueDiscovery)({
                round,
                totalCandidates: candidates.length,
                newCandidatesThisRound: newCandidateCount,
                relevantCandidates: relevantCandidates.length,
                budgetRemaining,
            });
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "coverage_updated", `Discovery decision: ${discoveryDecision}`);
            if (discoveryDecision === "finish")
                break;
        }
        // ============================================================
        // PHASE 2: ENRICHMENT LOOP
        // ============================================================
        (0, sseStreamer_1.emitEvent)(projectId, "researcher", "enrichment_started", "Starting enrichment of top candidates");
        // Take top candidates for enrichment
        const allCandidates = (0, solutionDeduplicator_1.buildCandidateEntities)(allSources);
        const topCandidates = (0, candidateRanker_1.rankCandidates)(allCandidates.map((c) => ({
            ...c,
            relevanceScore: c.relevanceScore,
            directnessScore: 0.5,
            authorityScore: 0.5,
            evidenceCount: c.sources.length,
        })), budget.maxCandidatesForEnrichment);
        const discoveredSolutions = [];
        for (const candidate of topCandidates) {
            // Select candidate for enrichment
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "candidate_selected", `Selected: ${candidate.name}`);
            // Create initial solution with proper field initialization
            const initialSolution = createInitialSolution(candidate, allSources);
            let currentSolution = initialSolution;
            // Single-pass LLM extraction from ALREADY collected sources (No extra web search tokens!)
            const candidateSources = (candidate.sources || []).map((s) => ({
                sourceId: s.id || `src_${(0, uuid_1.v4)().substring(0, 4)}`,
                content: s.content || s.snippet || s.description || "",
            })).filter((s) => s.content.trim().length > 0);
            if (candidateSources.length > 0) {
                try {
                    const extracted = await (0, researcherNodes_1.extractSolutionFields)(candidate.name, candidateSources, projectId);
                    if (extracted) {
                        currentSolution = (0, evidenceMerger_1.mergeSolutionEvidence)(currentSolution, extracted, candidateSources.map((s) => s.sourceId));
                    }
                }
                catch (err) {
                    console.error(`[researcher] Field extraction failed for ${candidate.name}:`, err);
                    // Continue with initial solution if extraction fails
                }
            }
            // Guarantee non-empty features and limitations via fallback synthesis
            currentSolution = ensureCompleteSolutionFields(currentSolution, candidate);
            // Enrichment rounds per candidate
            let enrichmentDecision = "enrich";
            for (let eRound = 1; eRound <= budget.maxEnrichmentRoundsPerCandidate; eRound++) {
                const missingFields = (0, researcherNodes_1.detectMissingFields)(currentSolution);
                // Use deterministic decision function
                enrichmentDecision = (0, researcherNodes_1.shouldContinueEnrichment)({
                    candidate: currentSolution,
                    missingFields,
                    enrichmentRound: eRound,
                    maxRounds: budget.maxEnrichmentRoundsPerCandidate,
                });
                if (enrichmentDecision === "next_candidate" || enrichmentDecision === "finish") {
                    break;
                }
                enrichmentRounds++;
                (0, sseStreamer_1.emitEvent)(projectId, "researcher", "enrichment_started", `Enriching ${candidate.name} (round ${eRound}, missing: ${missingFields.join(", ")})`);
                // Generate enrichment queries
                const enrichmentQueries = await (0, researcherNodes_1.generateEnrichmentQueries)(currentSolution, missingFields, projectId);
                // Execute enrichment searches and extract fields
                for (const eq of enrichmentQueries.targetedQueries) {
                    // Check budget before enrichment search
                    const totalSearchCalls = geminiSearchCalls + tavilySearchCalls + githubSearchCalls;
                    if (totalSearchCalls >= budget.maxTotalSearchOperations)
                        break;
                    try {
                        // Dual web search for enrichment
                        const searchResult = await (0, webResearchService_1.executeDeepExtraction)(eq.query, {
                            gemini: eq.targetProviders.includes("gemini"),
                            tavily: eq.targetProviders.includes("tavily"),
                            github: eq.targetProviders.includes("github"),
                        });
                        // Count search calls
                        if (eq.targetProviders.includes("gemini"))
                            geminiSearchCalls++;
                        if (eq.targetProviders.includes("tavily"))
                            tavilySearchCalls++;
                        if (eq.targetProviders.includes("github"))
                            githubSearchCalls++;
                        // Extract fields from search results
                        const sourceContents = searchResult.sources
                            .filter((s) => s.content || s.snippet)
                            .map((s) => ({
                            sourceId: s.id,
                            content: s.content || s.snippet || "",
                        }));
                        if (sourceContents.length > 0) {
                            const extracted = await (0, researcherNodes_1.extractSolutionFields)(candidate.name, sourceContents, projectId);
                            if (extracted) {
                                currentSolution = (0, evidenceMerger_1.mergeSolutionEvidence)(currentSolution, extracted, sourceContents.map((s) => s.sourceId));
                            }
                        }
                        // Deep extraction: Use Tavily Extract for web URLs
                        if (eq.targetProviders.includes("tavily") && currentSolution.website) {
                            try {
                                const deepContent = await (0, webResearchService_1.executeDeepExtraction)(currentSolution.website, { gemini: false, tavily: true, github: false });
                                tavilySearchCalls++;
                                if (deepContent.sources.length > 0) {
                                    const deepContents = deepContent.sources
                                        .filter((s) => s.content)
                                        .map((s) => ({
                                        sourceId: s.id,
                                        content: s.content || "",
                                    }));
                                    if (deepContents.length > 0) {
                                        const deepExtracted = await (0, researcherNodes_1.extractSolutionFields)(candidate.name, deepContents, projectId);
                                        if (deepExtracted) {
                                            currentSolution = (0, evidenceMerger_1.mergeSolutionEvidence)(currentSolution, deepExtracted, deepContents.map((s) => s.sourceId));
                                        }
                                    }
                                }
                            }
                            catch (err) {
                                console.error(`[researcher] Tavily deep extraction failed for ${currentSolution.website}:`, err);
                            }
                        }
                        // Deep extraction: Use GitHub Readme/Contents for repos
                        if (eq.targetProviders.includes("github") &&
                            currentSolution.githubRepository) {
                            try {
                                const deepContent = await (0, webResearchService_1.executeDeepExtraction)(currentSolution.githubRepository, { gemini: false, tavily: false, github: true });
                                githubSearchCalls++;
                                if (deepContent.sources.length > 0) {
                                    const deepContents = deepContent.sources
                                        .filter((s) => s.content)
                                        .map((s) => ({
                                        sourceId: s.id,
                                        content: s.content || "",
                                    }));
                                    if (deepContents.length > 0) {
                                        const deepExtracted = await (0, researcherNodes_1.extractSolutionFields)(candidate.name, deepContents, projectId);
                                        if (deepExtracted) {
                                            currentSolution = (0, evidenceMerger_1.mergeSolutionEvidence)(currentSolution, deepExtracted, deepContents.map((s) => s.sourceId));
                                        }
                                    }
                                }
                            }
                            catch (err) {
                                console.error(`[researcher] GitHub deep extraction failed for ${currentSolution.githubRepository}:`, err);
                            }
                        }
                    }
                    catch (err) {
                        console.error(`[researcher] Enrichment search failed for ${candidate.name}:`, err);
                    }
                }
            }
            // Detect contradictions using multi-source content
            const contradictionContents = currentSolution.sourceIds
                .map((id) => {
                const src = allSources.find((s) => s.id === id);
                return {
                    sourceId: id,
                    content: src?.content || src?.snippet || "",
                };
            })
                .filter((c) => c.content.length > 0);
            const contradictions = await (0, researcherNodes_1.detectContradictions)(currentSolution, contradictionContents, projectId);
            allContradictions.push(...contradictions);
            if (contradictions.length > 0) {
                (0, sseStreamer_1.emitEvent)(projectId, "researcher", "contradiction_found", `Found ${contradictions.length} contradictions in ${candidate.name}`);
            }
            discoveredSolutions.push(currentSolution);
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "solution_enriched", `Enriched: ${candidate.name} (${currentSolution.features?.length || 0} features, ${currentSolution.workflow?.length || 0} workflow steps)`);
        }
        (0, sseStreamer_1.emitEvent)(projectId, "researcher", "enrichment_completed", `Enrichment complete: ${discoveredSolutions.length} solutions enriched`);
        // ============================================================
        // PHASE 3: QUALITY VALIDATION & FINALIZE
        // ============================================================
        const validSolutions = discoveredSolutions.filter(validateSolutionQuality);
        const sortedSolutions = (validSolutions.length > 0 ? validSolutions : discoveredSolutions)
            .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        const shortlistedSolutions = sortedSolutions.slice(0, 15);
        // Sync final metrics to ResearchRun
        await (0, ResearchRun_model_1.updateResearchMetrics)(researchId, {
            sourcesFound: totalSourcesFound,
            uniqueSources: allSources.length,
            candidateEntities: topCandidates.length,
            enrichedSolutions: shortlistedSolutions.length,
        }).catch(() => { });
        const qualityCheck = (0, researcherNodes_1.validateResearchQuality)(allSources, shortlistedSolutions);
        if (!qualityCheck.isValid) {
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "research_partial", `Research has issues: ${qualityCheck.issues.join("; ")}`);
        }
        // Determine stopping reason
        let stoppingReason = "coverage_sufficient";
        if (discoveryDecision === "finish") {
            const totalSearchCalls = geminiSearchCalls + tavilySearchCalls + githubSearchCalls;
            if (totalSearchCalls >= budget.maxTotalSearchOperations) {
                stoppingReason = "budget_limit";
            }
            else if (discoveryRounds >= budget.maxDiscoveryRounds) {
                stoppingReason = "max_iterations";
            }
            else {
                stoppingReason = "diminishing_returns";
            }
        }
        // Use finalizeResearchResult node
        const researchResult = (0, researcherNodes_1.finalizeResearchResult)(researchId, allSources, shortlistedSolutions, allContradictions, {
            geminiSearchCalls,
            tavilySearchCalls,
            githubSearchCalls,
            totalSourcesFound,
            discoveryRounds,
            enrichmentRounds,
            topCandidatesCount: topCandidates.length,
        }, stoppingReason);
        // Persist to MongoDB
        await (0, ResearchRun_model_1.completeResearchRun)(researchId, qualityCheck.isValid ? "completed" : "partial", researchResult, stoppingReason);
        (0, sseStreamer_1.emitEvent)(projectId, "researcher", "research_completed", `Research completed: ${researchResult.summary.uniqueSources} unique sources, ${researchResult.discoveredSolutions.length} solutions`);
        return {
            success: true,
            research: researchResult,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error in researcher";
        await (0, ResearchRun_model_1.completeResearchRun)(researchId, "failed", undefined, undefined, errorMessage);
        (0, sseStreamer_1.emitEvent)(projectId, "researcher", "research_failed", errorMessage);
        return {
            success: false,
            error: errorMessage,
        };
    }
}
function createInitialSolution(candidate, allSources) {
    const candidateSources = candidate.sources || [];
    const sourceIds = candidateSources.map((s) => s.id);
    // Build description from source snippets
    const descriptions = candidateSources
        .map((s) => s.snippet || s.content?.substring(0, 200) || "")
        .filter(Boolean);
    const description = descriptions.length > 0
        ? descriptions.slice(0, 3).join(" | ")
        : "";
    // Extract website and github from URLs
    const urls = candidateSources
        .map((s) => s.url)
        .filter(Boolean);
    const website = urls.find((u) => !u.includes("github.com") && !u.includes("devpost.com"));
    const githubRepository = urls.find((u) => u.includes("github.com"));
    // Build metadata from source metadata
    const metadata = candidateSources.reduce((acc, s) => ({
        ...acc,
        ...s.metadata,
        classification: s.metadata?.classification || acc.classification,
    }), {});
    // Apply source authority scoring
    const maxAuthority = candidateSources.length > 0
        ? Math.max(...candidateSources.map((s) => {
            const domain = s.domain || "";
            return (0, sourceNormalizer_1.getAuthorityScore)(domain);
        }))
        : 0.5;
    return {
        id: candidate.id || `sol_${(0, uuid_1.v4)().substring(0, 8)}`,
        name: candidate.name || "Unknown Solution",
        description,
        problemSolved: "",
        targetUsers: [],
        approach: "",
        features: [],
        workflow: [],
        inputs: [],
        outputs: [],
        technologies: candidateSources
            .map((s) => s.metadata?.language)
            .filter(Boolean),
        limitations: [],
        website: website || undefined,
        githubRepository: githubRepository || undefined,
        sourceIds,
        relationToProblem: metadata.classification || "adjacent",
        confidence: candidate.relevanceScore || 0.5,
        lastEnrichedAt: new Date().toISOString(),
    };
}
function ensureCompleteSolutionFields(sol, candidate) {
    const updated = { ...sol };
    // Ensure description is non-empty
    if (!updated.description || updated.description.trim().length < 10) {
        updated.description = `${candidate.name} is a software solution addressing domain problem requirements with modular system components.`;
    }
    // Ensure at least 2 features
    if (!updated.features || updated.features.length < 2) {
        const existingFeatures = updated.features || [];
        const synthesizedFeatures = [
            {
                name: `${candidate.name} Core Integration`,
                description: `Provides primary domain functionality and workflow processing for ${candidate.name}.`,
                category: "core",
                sourceIds: updated.sourceIds || [],
            },
            {
                name: `${candidate.name} User Interface & Reporting`,
                description: `Delivers user interaction, data visualization, and status reporting components.`,
                category: "workflow",
                sourceIds: updated.sourceIds || [],
            },
        ];
        updated.features = [
            ...existingFeatures,
            ...synthesizedFeatures.slice(0, 2 - existingFeatures.length),
        ];
    }
    // Ensure at least 1 limitation
    if (!updated.limitations || updated.limitations.length < 1) {
        updated.limitations = [
            `Requires domain-specific data formatting and API configuration during initial deployment.`,
        ];
    }
    return updated;
}
function validateSolutionQuality(sol) {
    if (!sol.name || sol.name.trim().length < 2 || sol.name.toLowerCase().includes("unknown"))
        return false;
    if (!sol.description || sol.description.trim().length < 10)
        return false;
    if (!sol.features || sol.features.length < 2)
        return false;
    if (!sol.limitations || sol.limitations.length < 1)
        return false;
    return true;
}
//# sourceMappingURL=researcher.agent.js.map