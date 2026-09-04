"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hackathon_controller_1 = require("../controllers/hackathon.controller");
const router = (0, express_1.Router)();
router.post("/hackathons", hackathon_controller_1.createHackathon);
router.get("/hackathons/:id/status", hackathon_controller_1.getHackathonStatus);
router.post("/hackathons/:id/start", hackathon_controller_1.startHackathon);
router.get("/hackathons/:id/events", hackathon_controller_1.streamEvents);
// Agent 1: Problem Analysis
router.get("/hackathons/:id/analysis", hackathon_controller_1.getProblemAnalysis);
// Agent 2: Research Results
router.get("/hackathons/:id/research", hackathon_controller_1.getResearchResult);
router.get("/hackathons/:id/research-result", hackathon_controller_1.getResearchResult);
// Agent 3: Innovation Results & Candidate Selection
router.get("/hackathons/:id/innovation", hackathon_controller_1.getInnovationResult);
router.post("/hackathons/:id/select-candidate", hackathon_controller_1.selectCandidateHandler);
router.get("/hackathons/:id/select-candidate", (_req, res) => {
    res.status(405).json({
        success: false,
        error: "Method Not Allowed. Use HTTP POST with body: { \"candidateId\": \"string\" }",
    });
});
// Agent 4: Team Analysis & Tech Stack Selection
router.get("/hackathons/:id/team", hackathon_controller_1.getTeamAnalysis);
router.post("/hackathons/:id/select-tech-stack", hackathon_controller_1.selectTechStackHandler);
router.get("/hackathons/:id/select-tech-stack", (_req, res) => {
    res.status(405).json({
        success: false,
        error: "Method Not Allowed. Use HTTP POST with body: { \"optionId\": \"string\" }",
    });
});
// Agent 5: CTO / Architecture
router.get("/hackathons/:id/architecture", hackathon_controller_1.getArchitectureResult);
exports.default = router;
//# sourceMappingURL=hackathon.routes.js.map