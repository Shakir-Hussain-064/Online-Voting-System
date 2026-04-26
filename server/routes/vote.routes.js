import express from "express";
import {
  castVote,
  createCandidate,
  getAllVotes,
  getContestingParties,
  getCandidates,
  getVoteCounts
} from "../controllers/vote.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/parties", protect, authorizeRoles("citizen"), getContestingParties);
router.get("/candidates", protect, getCandidates);
router.post("/candidates", protect, authorizeRoles("admin"), createCandidate);
router.post("/cast", protect, authorizeRoles("citizen"), castVote);
router.get("/counts", protect, authorizeRoles("admin"), getVoteCounts);
router.get("/all", protect, authorizeRoles("admin"), getAllVotes);

export default router;
