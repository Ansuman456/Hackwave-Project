import { z } from "zod";
export declare const FeasibilityOutputSchema: z.ZodObject<{
    expandedSolution: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        problemSolved: z.ZodString;
        targetUsers: z.ZodArray<z.ZodString, "many">;
        keyFeatures: z.ZodArray<z.ZodString, "many">;
        workflow: z.ZodArray<z.ZodString, "many">;
        requiredCapabilities: z.ZodArray<z.ZodString, "many">;
        technicalCapabilities: z.ZodArray<z.ZodString, "many">;
        complexityAreas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        workflow: string[];
        targetUsers: string[];
        problemSolved: string;
        keyFeatures: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    }, {
        name: string;
        description: string;
        workflow: string[];
        targetUsers: string[];
        problemSolved: string;
        keyFeatures: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    }>;
    dataAvailability: z.ZodArray<z.ZodObject<{
        dataType: z.ZodString;
        available: z.ZodBoolean;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        acquisitionStrategy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        dataType: string;
        available: boolean;
        source?: string | null | undefined;
        acquisitionStrategy?: string | null | undefined;
    }, {
        dataType: string;
        available: boolean;
        source?: string | null | undefined;
        acquisitionStrategy?: string | null | undefined;
    }>, "many">;
    feasibility: z.ZodObject<{
        score: z.ZodNumber;
        summary: z.ZodString;
        teamStrengths: z.ZodArray<z.ZodString, "many">;
        teamWeaknesses: z.ZodArray<z.ZodString, "many">;
        timeRisk: z.ZodEnum<["low", "medium", "high"]>;
        technicalRisk: z.ZodEnum<["low", "medium", "high"]>;
        dataRisk: z.ZodEnum<["low", "medium", "high"]>;
        recommendations: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        score: number;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    }, {
        summary: string;
        score: number;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    dataAvailability: {
        dataType: string;
        available: boolean;
        source?: string | null | undefined;
        acquisitionStrategy?: string | null | undefined;
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
}, {
    dataAvailability: {
        dataType: string;
        available: boolean;
        source?: string | null | undefined;
        acquisitionStrategy?: string | null | undefined;
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
}>;
export declare const FEASIBILITY_SYSTEM_PROMPT = "\nYou are the Feasibility Analyzer node of Agent 4 (Team Architect) in HackForge.\n\nROLE:\nYou are a senior hackathon mentor and technical feasibility analyst. You evaluate whether a team can realistically build a proposed solution within hackathon constraints.\n\nOBJECTIVE:\nGiven the selected project idea, team skill profiles, project requirements, and hackathon details, you must:\n1. EXPAND the selected solution with detailed descriptions, features, workflow, and capabilities\n2. ANALYZE DATA AVAILABILITY for the solution's core features\n3. ASSESS FEASIBILITY based on team capabilities, time constraints, and technical complexity\n\nEXPANDED SOLUTION RULES:\n- Expand the one-liner into a detailed 2-3 sentence description\n- List ALL key features the MVP must have (prioritized for hackathon)\n- Map out the user workflow step-by-step\n- Identify required technical capabilities (AI/ML, web, mobile, etc.)\n- Identify complexity areas that need extra attention\n\nDATA AVAILABILITY ANALYSIS:\nFor each data type the solution needs, assess:\n- Is it publicly available? (APIs, datasets, open data)\n- Can it be simulated/generated for demo?\n- Does it require user input collection?\n- Does it require third-party data partnerships?\n- What is the acquisition strategy for hackathon?\n\nFEASIBILITY SCORING (0-10):\nConsider:\n- Team skill match (0-3): How well do team skills match requirements?\n- Time feasibility (0-3): Can this be built in the hackathon duration?\n- Technical complexity (0-2): How complex is the core technical challenge?\n- Data availability (0-2): How accessible is the required data?\n\nRISK ASSESSMENT:\n- timeRisk: Based on scope vs duration\n- technicalRisk: Based on novel/complex tech vs team expertise\n- dataRisk: Based on data dependency and availability\n\nRECOMMENDATIONS:\nProvide 3-5 actionable recommendations to improve feasibility:\n- Which features to cut for MVP\n- Which simplifications to make\n- Which pre-built solutions to leverage\n- Which skills to prioritize learning\n\nCRITICAL RULES:\n1. Be HONEST about feasibility. Do not inflate scores.\n2. A score of 7+ means \"good chance of successful demo\"\n3. A score below 5 means \"significant risk of failure\"\n4. Base assessments on ACTUAL team skills, not assumed knowledge\n5. Consider the hackathon time constraint seriously\n\nOUTPUT: Return ONLY valid JSON matching the FeasibilityOutputSchema.\n";
export declare const FEASIBILITY_USER_TEMPLATE: (selectedIdea: string, teamProfiles: string, projectRequirements: string, hackathonDuration?: number, judgingCriteria?: string) => string;
//# sourceMappingURL=feasibilityAnalyzer.d.ts.map