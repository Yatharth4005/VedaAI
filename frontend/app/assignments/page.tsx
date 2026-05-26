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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      <div className="hidden md:block shrink-0">
        <PageHeader title="Assignment" showBack={false} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col overflow-hidden relative min-h-0">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
            {/* Header Title with Active Green Indicator Dot */}
            <div className="mb-6 shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tight">
                  Assignments
                </h2>
              </div>
              <p className="text-sm font-medium text-[#6B7280]">
                Manage and create assignments for your classes.
              </p>
            </div>

            {/* Filter and Search Bar controls */}
            <div className="flex gap-3 mb-6 flex-wrap items-center shrink-0 select-none">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl h-10 px-4 bg-surface text-[#6B7280] border-border/80 font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <SlidersHorizontal size={16} />
                Filter By
              </Button>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <Input
                  placeholder="Search Assignment"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 pr-4 h-10 rounded-full bg-surface border-border/80 text-sm font-medium text-[#111827] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Grid List Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto pb-28 min-h-0 pr-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
                {filtered.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    onDelete={deleteAssignment}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-[#9CA3AF] font-medium py-16">
                  No assignments match your search.
                </p>
              )}
            </div>

            {/* Bottom Fade Mask Effect (Scroll Fade overlay) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

            {/* Floating pill CTA button */}
            <FloatingCreateButton />
          </div>
        )}
      </div>

      <FloatingCreateButton mobileFab />
    </div>
  );
}
