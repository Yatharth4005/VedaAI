"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSocket } from "@/hooks/useSocket";
import { useAssignmentStore } from "@/store/assignmentStore";
import { api } from "@/lib/api";
import { QuestionPaperView } from "@/components/question-paper/QuestionPaperView";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionPaper } from "@/lib/types";

const DownloadPDFButton = dynamic(
  () => import("@/components/pdf/DownloadPDFButton"),
  { ssr: false }
);

function AssignmentOutputInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isGenerating = searchParams.get("generating") === "true";

  const jobStatus = useAssignmentStore((s) => s.jobStatus);
  const jobProgress = useAssignmentStore((s) => s.jobProgress);
  const questionPaper = useAssignmentStore((s) => s.questionPaper);
  const setQuestionPaper = useAssignmentStore((s) => s.setQuestionPaper);
  const setJobStatus = useAssignmentStore((s) => s.setJobStatus);

  const [localPaper, setLocalPaper] = useState<QuestionPaper | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);

  const socketActive =
    isGenerating || jobStatus === "processing" || jobStatus === "pending";
  useSocket(socketActive ? id : null);

  const isLoading =
    jobStatus === "processing" ||
    jobStatus === "pending" ||
    (isGenerating && jobStatus !== "completed" && !localPaper);

  // Smooth progressive progress bar effect
  useEffect(() => {
    if (jobProgress === 0) {
      setSmoothProgress(0);
      return;
    }

    const timer = setInterval(() => {
      setSmoothProgress((prev) => {
        if (prev < jobProgress) {
          // Rapidly catch up to the backend's real progress (Ease-out transition)
          const diff = jobProgress - prev;
          const step = diff > 5 ? Math.ceil(diff / 6) : 1;
          return Math.min(prev + step, jobProgress);
        } else if (prev === 30 && jobProgress === 30) {
          // Gemini is thinking: slowly tick up 1% at a time to keep the UI alive and active
          return prev + 1;
        } else if (prev > 30 && prev < 70 && jobProgress === 30) {
          // Continue slowly ticking up while waiting for AI generation
          return prev + 1;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [jobProgress]);

  // Clean URL query parameters once paper is generated and ready
  useEffect(() => {
    if (questionPaper && isGenerating) {
      router.replace(`/assignments/${id}`);
    }
  }, [questionPaper, isGenerating, id, router]);

  // Initial load and status sync
  useEffect(() => {
    console.log(`[AssignmentOutput] Syncing initial status for assignment: ${id}`);
    api.assignments
      .get(id)
      .then((a) => {
        console.log(`[AssignmentOutput] Initial status fetch result: ${a.status}`);
        if (a.status === "completed") {
          api.assignments.result(id).then((paper) => {
            setQuestionPaper(paper);
            setLocalPaper(paper);
            setJobStatus("completed", 100);
          });
        } else if (a.status === "failed") {
          setJobStatus("failed");
        } else if (a.status === "processing" || a.status === "pending") {
          setJobStatus("processing", a.status === "processing" ? 30 : 10);
        }
      })
      .catch(() => {
        // Fallback to fetch result directly in case the assignment get endpoint failed but paper exists
        api.assignments
          .result(id)
          .then((paper) => {
            setQuestionPaper(paper);
            setLocalPaper(paper);
            setJobStatus("completed", 100);
          })
          .catch(() => {
            // Keep loading or set to processing 10
            setJobStatus("processing", 10);
          });
      });
  }, [id, setJobStatus, setQuestionPaper]);

  // Failsafe Polling Fallback: Check assignment status periodically if still loading/generating
  useEffect(() => {
    if (!isLoading) return;

    console.log(`[AssignmentOutput] Starting failsafe polling fallback for assignment: ${id}`);
    const interval = setInterval(() => {
      console.log(`[AssignmentOutput] Polling status for: ${id}`);
      api.assignments
        .get(id)
        .then((a) => {
          console.log(`[AssignmentOutput] Polled status: ${a.status}`);
          if (a.status === "completed") {
            api.assignments.result(id).then((paper) => {
              setQuestionPaper(paper);
              setLocalPaper(paper);
              setJobStatus("completed", 100);
            });
          } else if (a.status === "failed") {
            setJobStatus("failed");
          } else if (a.status === "processing") {
            // Sync progress incrementally if socket updates are missed
            if (jobProgress < 30) {
              setJobStatus("processing", 30);
            }
          }
        })
        .catch((err) => {
          console.error("[AssignmentOutput] Failsafe polling error:", err);
        });
    }, 3000);

    return () => {
      console.log(`[AssignmentOutput] Clearing failsafe polling fallback for: ${id}`);
      clearInterval(interval);
    };
  }, [id, isLoading, jobProgress, setJobStatus, setQuestionPaper]);

  useEffect(() => {
    if (questionPaper) setLocalPaper(questionPaper);
  }, [questionPaper]);

  async function handleRegenerate() {
    setRegenerating(true);
    setJobStatus("processing", 0);
    setSmoothProgress(0);
    setQuestionPaper(null);
    setLocalPaper(null);
    await api.assignments.regenerate(id);
    setRegenerating(false);
    router.replace(`/assignments/${id}?generating=true`);
  }


  const subject = localPaper?.metadata.subject ?? "your class";
  const cls = localPaper?.metadata.class ?? "";

  return (
    <div className="h-full overflow-y-auto pb-28 md:pb-6 bg-background touch-pan-y">
      <PageHeader
        title="Create New"
        backHref="/assignments"
      />

      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        {isLoading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={28} className="text-accent animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Generating your question paper…
            </h3>
            <Progress value={smoothProgress} className="h-2 max-w-xs mx-auto" />
            <p className="text-xs text-text-muted mt-2">{smoothProgress}%</p>
          </div>
        )}

        {jobStatus === "failed" && !localPaper && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium mb-4">
              Generation failed. Please try again.
            </p>
            <Button onClick={handleRegenerate}>Regenerate</Button>
          </div>
        )}

        {localPaper && !isLoading && (
          <>
            <div className="bg-cta rounded-2xl p-5 md:p-6 text-white shadow-md">
              <p className="text-sm md:text-base leading-relaxed mb-4 text-gray-100">
                Certainly! Here are customized Question Paper for your CBSE
                Grade {cls} {subject} classes:
              </p>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <DownloadPDFButton
                  paper={localPaper}
                  assignmentId={id}
                  variant="dark"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="hidden md:flex border-white/30 text-white bg-transparent hover:bg-white/10 rounded-xl gap-2"
                >
                  <RefreshCw
                    size={14}
                    className={regenerating ? "animate-spin" : ""}
                  />
                  Regenerate
                </Button>
              </div>
            </div>

            <QuestionPaperView paper={localPaper} />

            <div className="md:hidden flex justify-center pb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="rounded-xl gap-2"
              >
                <RefreshCw
                  size={14}
                  className={regenerating ? "animate-spin" : ""}
                />
                Regenerate
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AssignmentOutputClient() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-text-muted">Loading…</div>
      }
    >
      <AssignmentOutputInner />
    </Suspense>
  );
}
