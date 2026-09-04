"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFeatureLandscape = buildFeatureLandscape;
exports.identifyGaps = identifyGaps;
exports.calculateFeatureFrequency = calculateFeatureFrequency;
function buildFeatureLandscape(solutions) {
    const featureMap = new Map();
    for (const sol of solutions) {
        for (const feature of sol.features) {
            const canonical = feature.name.toLowerCase().trim();
            if (featureMap.has(canonical)) {
                const entry = featureMap.get(canonical);
                if (!entry.solutionIds.includes(sol.id)) {
                    entry.solutionIds.push(sol.id);
                }
                for (const srcId of feature.sourceIds) {
                    if (!entry.sourceIds.includes(srcId)) {
                        entry.sourceIds.push(srcId);
                    }
                }
                if (!entry.variants.includes(feature.name) && feature.name !== entry.description) {
                    entry.variants.push(feature.name);
                }
            }
            else {
                featureMap.set(canonical, {
                    canonicalName: feature.name,
                    description: feature.description,
                    category: feature.category,
                    variants: [feature.name],
                    solutionIds: [sol.id],
                    sourceIds: [...feature.sourceIds],
                });
            }
        }
    }
    const total = solutions.length;
    const landscape = [];
    for (const [key, entry] of featureMap) {
        const frequency = entry.solutionIds.length / total;
        const frequencyClass = frequency >= 0.5 ? "common" : frequency >= 0.25 ? "moderate" : "rare";
        landscape.push({
            featureId: `feat_${key.replace(/\s+/g, "_")}`,
            canonicalName: entry.canonicalName,
            description: entry.description,
            category: entry.category,
            occurrenceCount: entry.solutionIds.length,
            totalRelevantSolutions: total,
            frequency,
            solutionIds: entry.solutionIds,
            frequencyClass,
            variants: entry.variants,
            evidenceSourceIds: entry.sourceIds,
        });
    }
    // Sort by occurrence count descending
    landscape.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    return landscape;
}
function identifyGaps(featureLandscape, solutions, domainKeywords) {
    const gaps = [];
    let gapIdx = 1;
    // Gap 1: Rare features that are present but underused
    const rareFeatures = featureLandscape.filter((f) => f.frequencyClass === "rare" && f.occurrenceCount <= 2);
    if (rareFeatures.length > 0) {
        gaps.push({
            id: `gap_${gapIdx++}`,
            type: "feature",
            title: "Underused features with potential",
            description: `${rareFeatures.length} features appear in only 1-2 solutions: ${rareFeatures.slice(0, 3).map((f) => f.canonicalName).join(", ")}. These could be combined for differentiation.`,
            supportingSolutionIds: rareFeatures.flatMap((f) => f.solutionIds),
            supportingSourceIds: rareFeatures.flatMap((f) => f.evidenceSourceIds),
            impact: 7,
            confidence: 0.8,
        });
    }
    // Gap 2: Missing workflow automation
    const hasAutomation = solutions.some((s) => s.features.some((f) => f.category === "automation"));
    const hasWorkflow = solutions.some((s) => s.features.some((f) => f.category === "workflow"));
    if (!hasAutomation || !hasWorkflow) {
        gaps.push({
            id: `gap_${gapIdx++}`,
            type: "automation",
            title: "Limited automation and workflow integration",
            description: "Most solutions require manual intervention. An automated end-to-end workflow is a significant opportunity.",
            supportingSolutionIds: solutions.map((s) => s.id),
            supportingSourceIds: solutions.flatMap((s) => s.sourceIds),
            impact: 8,
            confidence: 0.75,
        });
    }
    // Gap 3: Constraint-based gaps (offline, low-budget, etc.)
    const allLimitations = solutions.flatMap((s) => s.limitations);
    const constraintKeywords = ["offline", "budget", "low bandwidth", "mobile", "privacy"];
    for (const constraint of constraintKeywords) {
        const affected = solutions.filter((s) => s.limitations.some((l) => l.toLowerCase().includes(constraint)));
        if (affected.length > 0 && affected.length < solutions.length * 0.5) {
            gaps.push({
                id: `gap_${gapIdx++}`,
                type: "constraint",
                title: `Limited ${constraint} support`,
                description: `${affected.length}/${solutions.length} solutions have limitations related to ${constraint}. Handling this constraint is an opportunity.`,
                supportingSolutionIds: affected.map((s) => s.id),
                supportingSourceIds: affected.flatMap((s) => s.sourceIds),
                impact: 6,
                confidence: 0.7,
            });
        }
    }
    // Gap 4: Underserved user segments
    const allUsers = new Map();
    for (const sol of solutions) {
        for (const user of sol.targetUsers) {
            const canonical = user.toLowerCase().trim();
            allUsers.set(canonical, (allUsers.get(canonical) || 0) + 1);
        }
    }
    // Check if the problem's own target users are well-covered
    const problemUserKeywords = domainKeywords.map((k) => k.toLowerCase());
    for (const [user, count] of allUsers) {
        if (count === 1) {
            const isProblemUser = problemUserKeywords.some((kw) => user.includes(kw));
            if (isProblemUser) {
                gaps.push({
                    id: `gap_${gapIdx++}`,
                    type: "user",
                    title: `Underserved user segment: ${user}`,
                    description: `Only one solution explicitly targets "${user}". This segment may be underserved.`,
                    supportingSolutionIds: solutions
                        .filter((s) => s.targetUsers.some((u) => u.toLowerCase().includes(user)))
                        .map((s) => s.id),
                    supportingSourceIds: solutions
                        .filter((s) => s.targetUsers.some((u) => u.toLowerCase().includes(user)))
                        .flatMap((s) => s.sourceIds),
                    impact: 7,
                    confidence: 0.7,
                });
            }
        }
    }
    return gaps;
}
function calculateFeatureFrequency(landscape) {
    return {
        common: landscape.filter((f) => f.frequencyClass === "common").map((f) => f.canonicalName),
        moderate: landscape.filter((f) => f.frequencyClass === "moderate").map((f) => f.canonicalName),
        rare: landscape.filter((f) => f.frequencyClass === "rare").map((f) => f.canonicalName),
    };
}
//# sourceMappingURL=gapAnalysis.js.map