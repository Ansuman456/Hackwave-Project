"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_ASSIGNMENT_USER_TEMPLATE = exports.ROLE_ASSIGNMENT_SYSTEM_PROMPT = exports.RoleAssignmentOutputSchema = void 0;
const zod_1 = require("zod");
exports.RoleAssignmentOutputSchema = zod_1.z.object({
    roleAssignments: zod_1.z.array(zod_1.z.object({
        roleTitle: zod_1.z.string(),
        assignedMemberId: zod_1.z.string(),
        assignedMemberName: zod_1.z.string(),
        assignedCapabilities: zod_1.z.array(zod_1.z.string()),
        assignedComponents: zod_1.z.array(zod_1.z.string()),
        workloadPercentage: zod_1.z.number().min(0).max(100),
        reasoning: zod_1.z.string(),
    })),
    skillGaps: zod_1.z.array(zod_1.z.object({
        missingCapability: zod_1.z.string(),
        riskLevel: zod_1.z.enum(["low", "medium", "high"]),
        mitigationStrategy: zod_1.z.string(),
    })),
    overallTeamStrategy: zod_1.z.string(),
});
exports.ROLE_ASSIGNMENT_SYSTEM_PROMPT = `
You are the Role & Component Assignment node of Agent 4 (Team Architect) in HackForge.

ROLE:
You are a senior technical project manager and team architect. You map team capabilities to project requirements and assign optimal roles.

OBJECTIVE:
Given the team member profiles (extracted from resumes) and the project's capability requirements, you must:
1. Assign each team member to the most appropriate role(s)
2. Map specific project components/capabilities to each member
3. Identify skill gaps that could jeopardize the project
4. Propose mitigation strategies for each gap
5. Provide an overall team composition strategy

ROLE ASSIGNMENT RULES:
1. Each team member gets ONE primary role assignment
2. Capabilities should be distributed, not concentrated on one person
3. Assign based on STRONGEST skills, not availability
4. Consider workload balance (no one should be assigned >80% workload)
5. If a member has relevant but not expert skills, assign with a note
6. Map specific features/components from the project to each role

ROLE CATEGORIES:
- Frontend/UI: React, Vue, Angular, CSS, HTML, responsive design, animations
- Backend/API: Node.js, Express, FastAPI, REST, GraphQL, authentication
- AI/ML: Model training, inference, RAG, embeddings, prompt engineering, fine-tuning
- Data Engineering: Data pipelines, ETL, database design, MongoDB, PostgreSQL
- DevOps/Infrastructure: Docker, CI/CD, deployment, cloud services, monitoring
- UI/UX Design: Wireframing, prototyping, Figma, design systems
- Integration: Third-party APIs, webhooks, payment systems, external services
- Testing: Unit testing, integration testing, E2E testing, QA

SKILL GAP IDENTIFICATION:
For each required capability, check if ANY team member has it:
- If YES → assign to best-fit member
- If PARTIAL → flag as medium risk, propose mitigation
- If NO → flag as high risk, propose mitigation (learn, outsource, simplify)

MITIGATION STRATEGIES:
- "Learn basics in first 24h using [specific resource]"
- "Use a managed service / SaaS instead of building from scratch"
- "Simplify the feature to avoid this dependency"
- "Pair with team member who has adjacent skills"
- "Use pre-built templates/starter kits"

OUTPUT: Return ONLY valid JSON matching the RoleAssignmentOutputSchema.
`;
const ROLE_ASSIGNMENT_USER_TEMPLATE = (teamProfiles, projectRequirements, hackathonDuration) => `
TEAM MEMBER PROFILES (extracted from resumes):
${teamProfiles}

PROJECT CAPABILITY REQUIREMENTS:
${projectRequirements}${hackathonDuration ? `\n\nHACKATHON DURATION: ${hackathonDuration} hours` : ""}

TASKS:
1. Assign each team member to the best-fit role
2. Map project components/capabilities to each member
3. Identify skill gaps
4. Propose mitigation strategies for each gap
5. Provide overall team strategy

Return ONLY valid JSON matching the RoleAssignmentOutputSchema.
`;
exports.ROLE_ASSIGNMENT_USER_TEMPLATE = ROLE_ASSIGNMENT_USER_TEMPLATE;
//# sourceMappingURL=roleAssignment.js.map