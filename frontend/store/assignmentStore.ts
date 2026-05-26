import { create } from "zustand";
import { Assignment, QuestionPaper, JobStatus } from "@/lib/types";

interface AssignmentStore {
  assignments: Assignment[];
  setAssignments: (a: Assignment[]) => void;
  addAssignment: (a: Assignment) => void;
  removeAssignment: (id: string) => void;
  currentAssignmentId: string | null;
  setCurrentId: (id: string) => void;
  jobStatus: JobStatus;
  jobProgress: number;
  setJobStatus: (s: JobStatus, progress?: number) => void;
  questionPaper: QuestionPaper | null;
  setQuestionPaper: (p: QuestionPaper | null) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  setAssignments: (assignments) => set({ assignments }),
  addAssignment: (a) =>
    set((s) => ({ assignments: [a, ...s.assignments] })),
  removeAssignment: (id) =>
    set((s) => ({
      assignments: s.assignments.filter((a) => a._id !== id),
    })),
  currentAssignmentId: null,
  setCurrentId: (id) => set({ currentAssignmentId: id }),
  jobStatus: "idle",
  jobProgress: 0,
  setJobStatus: (jobStatus, jobProgress = 0) => set({ jobStatus, jobProgress }),
  questionPaper: null,
  setQuestionPaper: (questionPaper) => set({ questionPaper }),
  reset: () =>
    set({
      currentAssignmentId: null,
      jobStatus: "idle",
      jobProgress: 0,
      questionPaper: null,
    }),
}));
