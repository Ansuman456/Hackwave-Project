import { HackathonState } from "./state";
export declare const hackforgeGraph: import("@langchain/langgraph").CompiledStateGraph<import("@langchain/langgraph").StateType<{
    projectId: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    input: {
        (): import("@langchain/langgraph").LastValue<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        (annotation: import("@langchain/langgraph").SingleReducer<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>): import("@langchain/langgraph").BinaryOperatorAggregate<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    problemAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null>;
    research: import("@langchain/langgraph").BinaryOperatorAggregate<{
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null>;
    innovation: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null>;
    teamAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null>;
    architecture: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null>;
    judging: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    improvementHistory: import("@langchain/langgraph").BinaryOperatorAggregate<{
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[], {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[]>;
    selectedVersion: import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
    build: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    status: import("@langchain/langgraph").BinaryOperatorAggregate<"failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection", "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection">;
    errors: import("@langchain/langgraph").BinaryOperatorAggregate<{
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[], {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[]>;
    usage: import("@langchain/langgraph").BinaryOperatorAggregate<{
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }, {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }>;
}>, import("@langchain/langgraph").UpdateType<{
    projectId: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    input: {
        (): import("@langchain/langgraph").LastValue<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        (annotation: import("@langchain/langgraph").SingleReducer<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>): import("@langchain/langgraph").BinaryOperatorAggregate<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    problemAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null>;
    research: import("@langchain/langgraph").BinaryOperatorAggregate<{
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null>;
    innovation: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null>;
    teamAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null>;
    architecture: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null>;
    judging: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    improvementHistory: import("@langchain/langgraph").BinaryOperatorAggregate<{
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[], {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[]>;
    selectedVersion: import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
    build: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    status: import("@langchain/langgraph").BinaryOperatorAggregate<"failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection", "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection">;
    errors: import("@langchain/langgraph").BinaryOperatorAggregate<{
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[], {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[]>;
    usage: import("@langchain/langgraph").BinaryOperatorAggregate<{
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }, {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }>;
}>, "strategist" | "researcher" | "teamArchitect" | "innovationAgent" | "__start__", {
    projectId: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    input: {
        (): import("@langchain/langgraph").LastValue<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        (annotation: import("@langchain/langgraph").SingleReducer<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>): import("@langchain/langgraph").BinaryOperatorAggregate<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    problemAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null>;
    research: import("@langchain/langgraph").BinaryOperatorAggregate<{
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null>;
    innovation: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null>;
    teamAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null>;
    architecture: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null>;
    judging: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    improvementHistory: import("@langchain/langgraph").BinaryOperatorAggregate<{
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[], {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[]>;
    selectedVersion: import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
    build: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    status: import("@langchain/langgraph").BinaryOperatorAggregate<"failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection", "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection">;
    errors: import("@langchain/langgraph").BinaryOperatorAggregate<{
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[], {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[]>;
    usage: import("@langchain/langgraph").BinaryOperatorAggregate<{
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }, {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }>;
}, {
    projectId: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    input: {
        (): import("@langchain/langgraph").LastValue<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        (annotation: import("@langchain/langgraph").SingleReducer<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>): import("@langchain/langgraph").BinaryOperatorAggregate<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    problemAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null>;
    research: import("@langchain/langgraph").BinaryOperatorAggregate<{
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null>;
    innovation: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null>;
    teamAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null>;
    architecture: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null>;
    judging: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    improvementHistory: import("@langchain/langgraph").BinaryOperatorAggregate<{
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[], {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[]>;
    selectedVersion: import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
    build: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    status: import("@langchain/langgraph").BinaryOperatorAggregate<"failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection", "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection">;
    errors: import("@langchain/langgraph").BinaryOperatorAggregate<{
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[], {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[]>;
    usage: import("@langchain/langgraph").BinaryOperatorAggregate<{
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }, {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }>;
}, import("@langchain/langgraph").StateDefinition>;
/**
 * Phase 1: Run Strategist → Researcher → Innovation.
 * Pauses after Innovation if no candidate is pre-selected.
 */
export declare function runHackforgeWorkflow(projectId: string, state: HackathonState): Promise<HackathonState>;
/**
 * Phase 2: After user selects a candidate, resume with TeamArchitect.
 * Loads current state, runs only the teamArchitect node.
 */
export declare function resumeAfterCandidateSelection(projectId: string, currentState: HackathonState): Promise<HackathonState>;
/**
 * Phase 3: After user selects a tech stack, resume with CTO Agent.
 * Runs the CTO node to generate the complete system architecture.
 */
export declare function resumeAfterTechStackSelection(projectId: string, currentState: HackathonState): Promise<HackathonState>;
//# sourceMappingURL=hackforgeGraph.d.ts.map