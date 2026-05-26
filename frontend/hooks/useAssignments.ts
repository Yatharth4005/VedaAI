"use client";

import { useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAssignmentStore } from "@/store/assignmentStore";

export function useAssignments() {
  const assignments = useAssignmentStore((s) => s.assignments);
  const setAssignments = useAssignmentStore((s) => s.setAssignments);
  const removeAssignment = useAssignmentStore((s) => s.removeAssignment);

  const load = useCallback(() => {
    api.assignments.list().then(setAssignments).catch(console.error);
  }, [setAssignments]);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteAssignment(id: string) {
    removeAssignment(id);
    try {
      await api.assignments.delete(id);
    } catch {
      load();
    }
  }

  return { assignments, deleteAssignment, reload: load };
}
