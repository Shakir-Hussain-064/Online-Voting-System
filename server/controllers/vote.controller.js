import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";
import Vote from "../models/vote.model.js";

export const getContestingParties = async (_req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });

    const partyMap = new Map();
    candidates.forEach((candidate) => {
      const partyKey = candidate.party.trim().toLowerCase();
      if (!partyMap.has(partyKey)) {
        partyMap.set(partyKey, {
          party: candidate.party,
          symbol: candidate.symbol,
          candidateId: candidate._id,
          candidateName: candidate.name
        });
      }
    });

    return res.status(200).json({ parties: Array.from(partyMap.values()) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCandidates = async (_req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return res.status(200).json({ candidates });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { name, party, symbol } = req.body;
    if (!name || !party || !symbol) {
      return res.status(400).json({ message: "Name, party and symbol are required" });
    }

    const candidate = await Candidate.create({ name, party, symbol });
    return res.status(201).json({ message: "Candidate created", candidate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const castVote = async (req, res) => {
  try {
    const { candidateId, faceEncoding } = req.body;

    if (!candidateId) {
      return res.status(400).json({ message: "Candidate ID is required" });
    }

    if (!faceEncoding) {
      return res.status(400).json({ message: "Face authentication is required to vote" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasVoted) {
      return res.status(409).json({ message: "Repeated Vote Detected" });
    }

    // Face is verified only during vote casting.
    if (user.faceEncoding && user.faceEncoding !== faceEncoding) {
      return res.status(401).json({ message: "Face authentication failed" });
    }

    // First successful face capture is stored as enrollment template.
    if (!user.faceEncoding) {
      user.faceEncoding = faceEncoding;
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await Vote.create({
      userId: user._id,
      candidateId: candidate._id,
      timestamp: new Date()
    });

    user.hasVoted = true;
    await user.save();

    return res.status(201).json({ message: "Vote cast successfully" });
  } catch (error) {
    // If unique index fails, user already has a vote record.
    if (error.code === 11000) {
      return res.status(409).json({ message: "Repeated Vote Detected" });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const getVoteCounts = async (_req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: "$candidateId",
          totalVotes: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidate"
        }
      },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 0,
          candidateId: "$candidate._id",
          name: "$candidate.name",
          party: "$candidate.party",
          symbol: "$candidate.symbol",
          totalVotes: 1
        }
      },
      { $sort: { totalVotes: -1 } }
    ]);

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllVotes = async (_req, res) => {
  try {
    const votes = await Vote.find()
      .populate("userId", "name voterId")
      .populate("candidateId", "name party symbol")
      .sort({ timestamp: -1 });

    return res.status(200).json({ votes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
