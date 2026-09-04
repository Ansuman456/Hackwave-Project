import { Router } from "express";
import {
  createHackathon,
  getHackathonStatus,
  startHackathon,
  streamEvents,
  getProblemAnalysis,
  getResearchResult,
  getInnovationResult,
  selectCandidateHandler,
  getTeamAnalysis,
  selectTechStackHandler,
  getArchitectureResult,
} from "../controllers/hackathon.controller";

const router = Router();

router.post("/hackathons", createHackathon);
router.get("/hackathons/:id/status", getHackathonStatus);
router.post("/hackathons/:id/start", startHackathon);
router.get("/hackathons/:id/events", streamEvents);

// Agent 1: Problem Analysis
router.get("/hackathons/:id/analysis", getProblemAnalysis);

// Agent 2: Research Results
router.get("/hackathons/:id/research", getResearchResult);
router.get("/hackathons/:id/research-result", getResearchResult);

// Agent 3: Innovation Results & Candidate Selection
router.get("/hackathons/:id/innovation", getInnovationResult);
router.post("/hackathons/:id/select-candidate", selectCandidateHandler);
router.get("/hackathons/:id/select-candidate", (_req, res) => {
  res.status(405).json({
    success: false,
    error: "Method Not Allowed. Use HTTP POST with body: { \"candidateId\": \"string\" }",
  });
});

// Agent 4: Team Analysis & Tech Stack Selection
router.get("/hackathons/:id/team", getTeamAnalysis);
router.post("/hackathons/:id/select-tech-stack", selectTechStackHandler);
router.get("/hackathons/:id/select-tech-stack", (_req, res) => {
  res.status(405).json({
    success: false,
    error: "Method Not Allowed. Use HTTP POST with body: { \"optionId\": \"string\" }",
  });
});

// Agent 5: CTO / Architecture
router.get("/hackathons/:id/architecture", getArchitectureResult);

export default router;
