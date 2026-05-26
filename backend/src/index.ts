import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { connectMongoDB } from "./lib/mongodb";
import { initSocket } from "./lib/socket";
import assignmentRoutes from "./routes/assignments";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://veda-ai-three-eta.vercel.app"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());
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
