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

    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";
    const socket = io(wsUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { assignmentId });
    });

    socket.on("job:progress", ({ progress }: { progress: number }) => {
      setJobStatus("processing", progress);
    });

    socket.on("job:complete", async () => {
      try {
        const paper = await api.assignments.result(assignmentId);
        setQuestionPaper(paper);
        setJobStatus("completed", 100);
      } catch {
        setJobStatus("failed");
      }
    });

    socket.on("job:failed", () => {
      setJobStatus("failed");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [assignmentId, setJobStatus, setQuestionPaper]);
}
