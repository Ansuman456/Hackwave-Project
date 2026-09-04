import { z } from "zod";
export declare const RoleAssignmentOutputSchema: z.ZodObject<{
    roleAssignments: z.ZodArray<z.ZodObject<{
        roleTitle: z.ZodString;
        assignedMemberId: z.ZodString;
        assignedMemberName: z.ZodString;
        assignedCapabilities: z.ZodArray<z.ZodString, "many">;
        assignedComponents: z.ZodArray<z.ZodString, "many">;
        workloadPercentage: z.ZodNumber;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reasoning: string;
        roleTitle: string;
        assignedMemberId: string;
        assignedMemberName: string;
        assignedCapabilities: string[];
        assignedComponents: string[];
        workloadPercentage: number;
    }, {
        reasoning: string;
        roleTitle: string;
        assignedMemberId: string;
        assignedMemberName: string;
        assignedCapabilities: string[];
        assignedComponents: string[];
        workloadPercentage: number;
    }>, "many">;
    skillGaps: z.ZodArray<z.ZodObject<{
        missingCapability: z.ZodString;
        riskLevel: z.ZodEnum<["low", "medium", "high"]>;
        mitigationStrategy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        missingCapability: string;
        riskLevel: "low" | "medium" | "high";
        mitigationStrategy: string;
    }, {
        missingCapability: string;
        riskLevel: "low" | "medium" | "high";
        mitigationStrategy: string;
    }>, "many">;
    overallTeamStrategy: z.ZodString;
}, "strip", z.ZodTypeAny, {
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
    overallTeamStrategy: string;
}, {
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
    overallTeamStrategy: string;
}>;
export declare const ROLE_ASSIGNMENT_SYSTEM_PROMPT = "\nYou are the Role & Component Assignment node of Agent 4 (Team Architect) in HackForge.\n\nROLE:\nYou are a senior technical project manager and team architect. You map team capabilities to project requirements and assign optimal roles.\n\nOBJECTIVE:\nGiven the team member profiles (extracted from resumes) and the project's capability requirements, you must:\n1. Assign each team member to the most appropriate role(s)\n2. Map specific project components/capabilities to each member\n3. Identify skill gaps that could jeopardize the project\n4. Propose mitigation strategies for each gap\n5. Provide an overall team composition strategy\n\nROLE ASSIGNMENT RULES:\n1. Each team member gets ONE primary role assignment\n2. Capabilities should be distributed, not concentrated on one person\n3. Assign based on STRONGEST skills, not availability\n4. Consider workload balance (no one should be assigned >80% workload)\n5. If a member has relevant but not expert skills, assign with a note\n6. Map specific features/components from the project to each role\n\nROLE CATEGORIES:\n- Frontend/UI: React, Vue, Angular, CSS, HTML, responsive design, animations\n- Backend/API: Node.js, Express, FastAPI, REST, GraphQL, authentication\n- AI/ML: Model training, inference, RAG, embeddings, prompt engineering, fine-tuning\n- Data Engineering: Data pipelines, ETL, database design, MongoDB, PostgreSQL\n- DevOps/Infrastructure: Docker, CI/CD, deployment, cloud services, monitoring\n- UI/UX Design: Wireframing, prototyping, Figma, design systems\n- Integration: Third-party APIs, webhooks, payment systems, external services\n- Testing: Unit testing, integration testing, E2E testing, QA\n\nSKILL GAP IDENTIFICATION:\nFor each required capability, check if ANY team member has it:\n- If YES \u2192 assign to best-fit member\n- If PARTIAL \u2192 flag as medium risk, propose mitigation\n- If NO \u2192 flag as high risk, propose mitigation (learn, outsource, simplify)\n\nMITIGATION STRATEGIES:\n- \"Learn basics in first 24h using [specific resource]\"\n- \"Use a managed service / SaaS instead of building from scratch\"\n- \"Simplify the feature to avoid this dependency\"\n- \"Pair with team member who has adjacent skills\"\n- \"Use pre-built templates/starter kits\"\n\nOUTPUT: Return ONLY valid JSON matching the RoleAssignmentOutputSchema.\n";
export declare const ROLE_ASSIGNMENT_USER_TEMPLATE: (teamProfiles: string, projectRequirements: string, hackathonDuration?: number) => string;
//# sourceMappingURL=roleAssignment.d.ts.map