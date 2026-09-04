"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSolutionEvidence = mergeSolutionEvidence;
exports.mergeSearchResults = mergeSearchResults;
function mergeSolutionEvidence(existing, newEvidence, sourceIds) {
    if (!existing) {
        return {
            id: newEvidence.id || "",
            name: newEvidence.name || "Unknown Solution",
            description: newEvidence.description || "",
            problemSolved: newEvidence.problemSolved || "",
            targetUsers: newEvidence.targetUsers || [],
            approach: newEvidence.approach || "",
            features: newEvidence.features || [],
            workflow: newEvidence.workflow || [],
            inputs: newEvidence.inputs || [],
            outputs: newEvidence.outputs || [],
            technologies: newEvidence.technologies || [],
            limitations: newEvidence.limitations || [],
            website: newEvidence.website,
            githubRepository: newEvidence.githubRepository,
            sourceIds: sourceIds,
            relationToProblem: newEvidence.relationToProblem || "adjacent",
            confidence: newEvidence.confidence || 0.5,
            lastEnrichedAt: new Date().toISOString(),
        };
    }
    // Merge features - deduplicate by name similarity
    const allFeatures = [...existing.features];
    for (const feature of newEvidence.features || []) {
        const isDuplicate = allFeatures.some((f) => f.name.toLowerCase() === feature.name.toLowerCase() ||
            areSimilarStrings(f.name, feature.name));
        if (!isDuplicate) {
            allFeatures.push(feature);
        }
        else {
            // Merge source IDs into existing feature
            const existingFeature = allFeatures.find((f) => f.name.toLowerCase() === feature.name.toLowerCase() ||
                areSimilarStrings(f.name, feature.name));
            if (existingFeature) {
                existingFeature.sourceIds = [
                    ...new Set([...existingFeature.sourceIds, ...feature.sourceIds]),
                ];
                // Use longer description if available
                if (feature.description.length > existingFeature.description.length) {
                    existingFeature.description = feature.description;
                }
            }
        }
    }
    // Merge workflow steps
    const allWorkflow = [...existing.workflow];
    for (const step of newEvidence.workflow || []) {
        const isDuplicate = allWorkflow.some((w) => w.action.toLowerCase() === step.action.toLowerCase() ||
            areSimilarStrings(w.action, step.action));
        if (!isDuplicate) {
            allWorkflow.push(step);
        }
    }
    // Merge arrays with dedup
    const mergeArrays = (a, b) => {
        const result = [...a];
        for (const item of b || []) {
            if (!result.some((r) => areSimilarStrings(r, item))) {
                result.push(item);
            }
        }
        return result;
    };
    return {
        ...existing,
        description: newEvidence.description && newEvidence.description.length > existing.description.length
            ? newEvidence.description
            : existing.description,
        problemSolved: newEvidence.problemSolved &&
            newEvidence.problemSolved.length > existing.problemSolved.length
            ? newEvidence.problemSolved
            : existing.problemSolved,
        targetUsers: mergeArrays(existing.targetUsers, newEvidence.targetUsers || []),
        approach: newEvidence.approach && newEvidence.approach.length > existing.approach.length
            ? newEvidence.approach
            : existing.approach,
        features: allFeatures,
        workflow: allWorkflow,
        inputs: mergeArrays(existing.inputs, newEvidence.inputs || []),
        outputs: mergeArrays(existing.outputs, newEvidence.outputs || []),
        technologies: mergeArrays(existing.technologies, newEvidence.technologies || []),
        limitations: mergeArrays(existing.limitations, newEvidence.limitations || []),
        website: newEvidence.website || existing.website,
        githubRepository: newEvidence.githubRepository || existing.githubRepository,
        sourceIds: [...new Set([...existing.sourceIds, ...sourceIds])],
        confidence: Math.max(existing.confidence, newEvidence.confidence || 0),
        lastEnrichedAt: new Date().toISOString(),
    };
}
function areSimilarStrings(a, b) {
    const normalize = (s) => s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim();
    const na = normalize(a);
    const nb = normalize(b);
    if (na === nb)
        return true;
    if (na.includes(nb) || nb.includes(na))
        return true;
    // Simple word overlap
    const wordsA = new Set(na.split(/\s+/));
    const wordsB = new Set(nb.split(/\s+/));
    const intersection = [...wordsA].filter((w) => wordsB.has(w) && w.length > 2);
    const union = new Set([...wordsA, ...wordsB]);
    if (union.size === 0)
        return false;
    return intersection.length / union.size > 0.6;
}
function mergeSearchResults(geminiResults, tavilyResults, queryId, sourceType) {
    const sources = [];
    const seenUrls = new Map();
    const toSource = (r, provider) => {
        if (!r.url)
            return null;
        try {
            new URL(r.url);
        }
        catch {
            return null;
        }
        return {
            id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            title: r.title || r.domain,
            url: r.url,
            canonicalUrl: r.url,
            domain: r.domain,
            sourceType,
            discoveredBy: [provider],
            searchQueryIds: [queryId],
            snippet: r.snippet || "",
            retrievedAt: new Date().toISOString(),
            relevanceScore: 0.5,
            authorityScore: 0.5,
            extractionStatus: r.snippet ? "success" : "partial",
            metadata: {},
        };
    };
    for (const r of geminiResults) {
        const source = toSource(r, "gemini");
        if (!source)
            continue;
        const normalized = source.url;
        if (seenUrls.has(normalized)) {
            const existing = seenUrls.get(normalized);
            existing.discoveredBy.push("gemini");
            existing.searchQueryIds.push(queryId);
        }
        else {
            seenUrls.set(normalized, source);
            sources.push(source);
        }
    }
    for (const r of tavilyResults) {
        const source = toSource(r, "tavily");
        if (!source)
            continue;
        const normalized = source.url;
        if (seenUrls.has(normalized)) {
            const existing = seenUrls.get(normalized);
            existing.discoveredBy.push("tavily");
            existing.searchQueryIds.push(queryId);
            if (r.content)
                existing.content = r.content;
        }
        else {
            if (r.content)
                source.content = r.content;
            seenUrls.set(normalized, source);
            sources.push(source);
        }
    }
    return sources;
}
//# sourceMappingURL=evidenceMerger.js.map