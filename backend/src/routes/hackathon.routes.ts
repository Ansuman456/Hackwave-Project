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
  getTeamSkillAnalysisHandler,
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

// Agent 4: Team Analysis & Tech Stack Selection
router.get("/hackathons/:id/team", getTeamAnalysis);
router.post("/hackathons/:id/select-tech-stack", selectTechStackHandler);

// Agent 5: Team Skill Graph & Task Allocation
router.get("/hackathons/:id/team-skill", getTeamSkillAnalysisHandler);

export default router;
