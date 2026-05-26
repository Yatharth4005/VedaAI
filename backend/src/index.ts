import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { connectMongoDB } from "./lib/mongodb";
import { initSocket } from "./lib/socket";
import assignmentRoutes from "./routes/assignments";

const app = express();
const httpServer = createServer(app);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/assignments", assignmentRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

initSocket(httpServer);

const PORT = parseInt(process.env.PORT ?? "4000", 10);

async function start() {
  await connectMongoDB();
  httpServer.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
