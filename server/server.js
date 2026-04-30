import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import voteRoutes from "./routes/vote.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "Online Voting API is running",
    health: "/api/health"
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);

const clientBuildPath = path.join(__dirname, "..", "client", "build");
const clientIndexPath = path.join(clientBuildPath, "index.html");
const hasClientBuild = fs.existsSync(clientIndexPath);

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(clientIndexPath);
  });
} else {
  console.warn(
    `Client build not found at ${clientIndexPath}. Non-API routes will return 404.`
  );
}

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
