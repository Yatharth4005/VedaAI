"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Assignment } from "@/lib/types";
import { toDisplayDate } from "@/lib/utils";
interface Props {
  assignment: Assignment;
  onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayTitle =
    assignment.title && !assignment.title.startsWith("Assignment –")
      ? assignment.title
      : `Quiz on ${assignment.subject}`;

  return (
    <div className="bg-surface border border-border/80 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between min-h-[140px]">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/assignments/${assignment._id}`}
          className="font-extrabold text-[#111827] text-base leading-snug hover:text-[#F97316] line-clamp-2 pr-4 transition-colors"
        >
          {displayTitle}
        </Link>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 text-[#9CA3AF] transition-colors"
            aria-label="Options"
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-30 w-44 bg-surface border border-border/80 rounded-[16px] shadow-xl py-1.5 overflow-hidden transition-all duration-150">
              <Link
                href={`/assignments/${assignment._id}`}
                className="block px-4 py-2.5 text-sm font-bold text-[#111827] hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(assignment._id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs mt-6 pt-4 border-t border-border/40 select-none">
        <span className="text-[#6B7280] font-semibold">
          Assigned on : <span className="text-[#111827] font-extrabold">{toDisplayDate(assignment.createdAt)}</span>
        </span>
        <span className="text-[#6B7280] font-semibold">
          Due : <span className="text-[#111827] font-extrabold">{toDisplayDate(assignment.dueDate)}</span>
        </span>
      </div>
    </div>
  );
}
