"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAssignmentStore } from "@/store/assignmentStore";
import { api } from "@/lib/api";

export function useSocket(assignmentId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const setJobStatus = useAssignmentStore((s) => s.setJobStatus);
  const setQuestionPaper = useAssignmentStore((s) => s.setQuestionPaper);

  useEffect(() => {
    if (!assignmentId) return;

    let wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";
    if (wsUrl && !wsUrl.startsWith("http://") && !wsUrl.startsWith("https://") && !wsUrl.startsWith("ws://") && !wsUrl.startsWith("wss://")) {
      wsUrl = `https://${wsUrl}`;
    }
    const socket = io(wsUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`[useSocket] Connected to backend Socket.io server. Joining room: ${assignmentId}`);
      socket.emit("join", { assignmentId });
    });

    socket.on("connect_error", (err: Error) => {
      console.error("[useSocket] Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("[useSocket] Socket disconnected:", reason);
    });

    socket.on("job:progress", ({ progress }: { progress: number }) => {
      console.log(`[useSocket] Received job:progress event for ${assignmentId}: ${progress}%`);
      setJobStatus("processing", progress);
    });

    socket.on("job:complete", async () => {
      console.log(`[useSocket] Received job:complete event for ${assignmentId}. Fetching result...`);
      try {
        const paper = await api.assignments.result(assignmentId);
        setQuestionPaper(paper);
        setJobStatus("completed", 100);
      } catch (err) {
        console.error("[useSocket] Failed to fetch completed question paper:", err);
        setJobStatus("failed");
      }
    });

    socket.on("job:failed", ({ error }: { error?: string } = {}) => {
      console.error(`[useSocket] Received job:failed event for ${assignmentId}:`, error);
      setJobStatus("failed");
    });

    return () => {
      console.log(`[useSocket] Cleaning up socket connection for assignment: ${assignmentId}`);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [assignmentId, setJobStatus, setQuestionPaper]);
}
