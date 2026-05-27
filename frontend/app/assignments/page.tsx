"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/assignments/EmptyState";
import { AssignmentCard } from "@/components/assignments/AssignmentCard";
import { FloatingCreateButton } from "@/components/assignments/FloatingCreateButton";
import { useAssignments } from "@/hooks/useAssignments";

export default function AssignmentsPage() {
  const { assignments, deleteAssignment } = useAssignments();
  const [search, setSearch] = useState("");
  const isEmpty = assignments.length === 0;

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#EAEAEA] md:bg-background relative">
      <div className="shrink-0">
        <PageHeader title="Assignments" showBack={true} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col overflow-hidden relative min-h-0">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
            {/* Header Title with Active Green Indicator Dot */}
            <div className="hidden md:block mb-6 shrink-0">
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

            {/* Combined Filter and Search Bar controls */}
            <div className="flex items-center w-full bg-surface border border-border/60 rounded-2xl p-2 gap-3 mb-6 shrink-0 select-none max-w-md shadow-sm">
              {/* Filter Button */}
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-all active:scale-[0.98]"
              >
                <SlidersHorizontal size={14} />
                Filter
              </button>

              {/* Separator Line */}
              <div className="w-px h-5 bg-border/60 shrink-0" />

              {/* Search Input */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent pl-8 pr-3 h-8 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-0 focus:border-none border-none"
                />
              </div>
            </div>

            {/* Grid List Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4 touch-pan-y">
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

              {/* Physical spacer to guarantee the last card clears the floating bottom tab bar on mobile */}
              <div className="h-[120px] md:hidden" />
            </div>

            {/* Bottom Fade Mask Effect (Scroll Fade overlay) */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

            {/* Floating pill CTA button */}
            <FloatingCreateButton />
          </div>
        )}
      </div>

      <FloatingCreateButton mobileFab />
    </div>
  );
}
