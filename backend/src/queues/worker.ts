import "dotenv/config";
import { Worker } from "bullmq";
import { io as SocketClient, Socket } from "socket.io-client";
import { redis } from "../lib/redis";
import { connectMongoDB } from "../lib/mongodb";
import Assignment from "../models/Assignment";
import QuestionPaper from "../models/QuestionPaper";
import { generateQuestionPaper } from "../services/aiService";
import { AssignmentJobData } from "./assignmentQueue";

const serverUrl = process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 4000}`;

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    console.log(`[worker-socket] Initializing socket connection to: ${serverUrl}`);
    socket = SocketClient(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[worker-socket] Connected to backend socket server");
    });

    socket.on("connect_error", (err: Error) => {
      console.error("[worker-socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("[worker-socket] Disconnected from backend socket server:", reason);
    });
  }
  return socket;
}

// Initialize socket immediately
getSocket();

async function emitToRoom(
  assignmentId: string,
  event: string,
  data: object
): Promise<void> {
  const client = getSocket();
  
  if (!client.connected) {
    await new Promise<void>((resolve) => {
      const handleConnect = () => {
        clearTimeout(timeout);
        resolve();
      };
      const timeout = setTimeout(() => {
        client.off("connect", handleConnect);
        resolve();
      }, 3000);
      client.once("connect", handleConnect);
    });
  }
  
  client.emit("server-emit", { room: assignmentId, event, data });
}

async function main() {
  await connectMongoDB();
  console.log("Worker started, listening for jobs...");

  const worker = new Worker<AssignmentJobData>(
    "assignment-generation",
    async (job) => {
      const { assignmentId } = job.data;

      try {
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: "processing",
        });
        await emitToRoom(assignmentId, "job:progress", {
          assignmentId,
          progress: 10,
        });

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) throw new Error("Assignment not found");

        await emitToRoom(assignmentId, "job:progress", {
          assignmentId,
          progress: 30,
        });

        const paper = await generateQuestionPaper(assignment);

        await emitToRoom(assignmentId, "job:progress", {
          assignmentId,
          progress: 75,
        });

        await QuestionPaper.create({
          assignmentId,
          metadata: paper.metadata,
          sections: paper.sections,
          answerKey: paper.answerKey,
          generatedAt: new Date(),
        });

        await Assignment.findByIdAndUpdate(assignmentId, {
          status: "completed",
          title: `${paper.metadata.subject} – Class ${paper.metadata.class}`,
        });

        await emitToRoom(assignmentId, "job:progress", {
          assignmentId,
          progress: 100,
        });
        await emitToRoom(assignmentId, "job:complete", { assignmentId });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: "failed",
          errorMessage: message,
        });
        await emitToRoom(assignmentId, "job:failed", {
          assignmentId,
          error: message,
        });
        throw error;
      }
    },
    { connection: redis, concurrency: 2 }
  );

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });
}

main().catch((err) => {
  console.error("Worker failed to start:", err);
  process.exit(1);
});
