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
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between gap-2 mb-6">
        <Link
          href={`/assignments/${assignment._id}`}
          className="font-semibold text-text-primary text-sm leading-snug hover:text-accent line-clamp-2 pr-2"
        >
          {displayTitle}
        </Link>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 text-text-muted"
            aria-label="Options"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-40 bg-surface border border-border rounded-xl shadow-lg py-1 overflow-hidden">
              <Link
                href={`/assignments/${assignment._id}`}
                className="block px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
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
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>Assigned on: {toDisplayDate(assignment.createdAt)}</span>
        <span>Due: {toDisplayDate(assignment.dueDate)}</span>
      </div>
    </div>
  );
}
