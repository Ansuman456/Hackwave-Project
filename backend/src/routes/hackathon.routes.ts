import { Router } from "express";
import { uploadResumes } from "../middleware/upload.middleware";
import { isAuth } from "../middleware/auth.middleware";
import {
  createHackathon,
  listHackathons,
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

router.get("/hackathons", isAuth, listHackathons);
router.post("/hackathons", isAuth, uploadResumes, createHackathon);
router.get("/hackathons/:id/status", isAuth, getHackathonStatus);
router.post("/hackathons/:id/start", isAuth, startHackathon);
router.get("/hackathons/:id/events", isAuth, streamEvents);

// Agent 1: Problem Analysis
router.get("/hackathons/:id/analysis", isAuth, getProblemAnalysis);

// Agent 2: Research Results
router.get("/hackathons/:id/research", isAuth, getResearchResult);
router.get("/hackathons/:id/research-result", isAuth, getResearchResult);

// Agent 3: Innovation Results & Candidate Selection
router.get("/hackathons/:id/innovation", isAuth, getInnovationResult);
router.post("/hackathons/:id/select-candidate", isAuth, selectCandidateHandler);
router.get("/hackathons/:id/select-candidate", (_req, res) => {
  res.status(405).json({
    success: false,
    error: "Method Not Allowed. Use HTTP POST with body: { \"candidateId\": \"string\" }",
  });
});

// Agent 4: Team Analysis & Tech Stack Selection
router.get("/hackathons/:id/team", isAuth, getTeamAnalysis);
router.post("/hackathons/:id/select-tech-stack", isAuth, selectTechStackHandler);
router.get("/hackathons/:id/select-tech-stack", (_req, res) => {
  res.status(405).json({
    success: false,
    error: "Method Not Allowed. Use HTTP POST with body: { \"optionId\": \"string\" }",
  });
});

// Agent 5: CTO / Architecture
router.get("/hackathons/:id/architecture", isAuth, getArchitectureResult);

export default router;
