"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/assignments/EmptyState";
import { AssignmentCard } from "@/components/assignments/AssignmentCard";
import { FloatingCreateButton } from "@/components/assignments/FloatingCreateButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssignments } from "@/hooks/useAssignments";

export default function AssignmentsPage() {
  const { assignments, deleteAssignment } = useAssignments();
  const [search, setSearch] = useState("");
  const isEmpty = assignments.length === 0;

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-background">
      <div className="hidden md:block">
        <PageHeader title="Assignment" showBack={false} />
      </div>

      <div className="p-4 md:p-6">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1 md:hidden">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-lg font-semibold text-text-primary">
                  Assignments
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-xl font-semibold text-text-primary">
                  Assignments
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                Manage and create assignments for your classes.
              </p>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap items-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl h-10 px-4 bg-surface text-text-secondary border-border"
              >
                <SlidersHorizontal size={16} />
                Filter By
              </Button>
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <Input
                  placeholder="Search Assignment"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-surface border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <AssignmentCard
                  key={a._id}
                  assignment={a}
                  onDelete={deleteAssignment}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-text-muted py-12">
                No assignments match your search.
              </p>
            )}

            <FloatingCreateButton />
          </>
        )}
      </div>

      <FloatingCreateButton mobileFab />
    </div>
  );
}
