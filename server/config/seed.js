import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../db.js";
import Candidate from "../models/candidate.model.js";

dotenv.config();

const seedCandidates = async () => {
  try {
    await connectDB();

    const existing = await Candidate.countDocuments();
    if (existing > 0) {
      console.log("Candidates already exist. Skipping seed.");
      await mongoose.connection.close();
      return;
    }

    await Candidate.insertMany([
      { name: "Aarav Sharma", party: "Progress Party", symbol: "Sun" },
      { name: "Diya Verma", party: "Unity Front", symbol: "Tree" },
      { name: "Kabir Mehta", party: "Citizens Alliance", symbol: "Book" }
    ]);

    console.log("Candidates seeded successfully.");
    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedCandidates();
