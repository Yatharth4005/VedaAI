"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PieChart,
  Settings,
  Sparkles,
  Book,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentStore } from "@/store/assignmentStore";
import { VedaLogo } from "./VedaLogo";
import Image from "next/image";

// Custom high-fidelity icon for "My Groups" matching Image 1 exactly
function MyGroupsIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer rounded rect card enclosing the student avatar */}
      <rect x="2" y="4" width="20" height="16" rx="4" fill="currentColor" stroke="none" />
      {/* Punch-out silhouette of head */}
      <circle cx="10" cy="10" r="2.2" fill="white" stroke="none" />
      {/* Punch-out silhouette of body (raising arm) */}
      <path
        d="M5.5 17.5C5.5 14.8 7.5 13.2 10 13.2C12.5 13.2 14.5 14.8 14.5 17.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Raised Arm line */}
      <path
        d="M13 13.5L16.5 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Raised Hand dot */}
      <circle cx="17.8" cy="7.8" r="1" fill="white" stroke="none" />
    </svg>
  );
}

// Custom high-fidelity icon for "Assignments" matching Image 1 exactly
function AssignmentsIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Document page with folded dog-ear corner */}
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z" />
      <path d="M14 2v4a1.5 1.5 0 0 0 1.5 1.5h4" strokeWidth="2.2" />
      {/* Rounded list items inside the page */}
      <circle cx="8.5" cy="12.5" r="1.1" fill="currentColor" stroke="none" />
      <line x1="12" y1="12.5" x2="16.5" y2="12.5" />
      <circle cx="8.5" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
      <line x1="12" y1="16.5" x2="16.5" y2="16.5" />
    </svg>
  );
}

const navItems = [
  { label: "Home", href: "/home", icon: LayoutGrid },
  { label: "My Groups", href: "/groups", icon: MyGroupsIcon },
  { label: "Assignments", href: "/assignments", icon: AssignmentsIcon, badgeKey: "assignments" as const },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: Book },
  { label: "My Library", href: "/library", icon: PieChart, badgeKey: "library" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const assignmentCount = useAssignmentStore((s) => s.assignments.length);
  const libraryCount = 0; // Library is currently empty

  return (
    <div className="w-[260px] h-full flex flex-col bg-surface border border-border/80 rounded-[24px] shadow-sm shrink-0 overflow-hidden py-6 px-4">
      {/* Brand Logo Header */}
      <div className="px-3 mb-6">
        <VedaLogo />
      </div>

      {/* Glossy Capsule Create Assignment Button */}
      <div className="px-2 mb-6">
        <Link
          href="/assignments/new"
          className={cn(
            "flex items-center justify-center gap-2.5 w-full h-11 rounded-full",
            "bg-gradient-to-b from-[#2E333A] to-[#1A1D23] text-white text-sm font-bold shadow-md",
            "border-[2px] border-[#FF7E40]/90",
            "hover:border-[#EA4D10] transition-all active:scale-[0.98]"
          )}
        >
          <Sparkles size={16} fill="white" className="text-white" />
          Create Assignment
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-1 space-y-1">
        {navItems.map(({ label, href, icon: Icon, badgeKey }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href)) ||
            (href === "/assignments" && pathname.startsWith("/assignments")); // Maintain active state on subpages

          const badge =
            badgeKey === "assignments" && assignmentCount > 0
              ? assignmentCount
              : badgeKey === "library" && libraryCount > 0
                ? libraryCount
                : null;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#F3F4F6] text-[#111827]"
                  : "text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} className={isActive ? "text-[#111827]" : "text-[#6B7280]"} />
              <span className="flex-1 tracking-tight">{label}</span>
              {badge !== null && (
                <span className="bg-[#F97316] text-white text-[11px] font-extrabold rounded-full px-2 py-0.5 min-w-[20px] text-center leading-none">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Settings & School Card */}
      <div className="px-1 pt-4 border-t border-border/60 space-y-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            pathname === "/settings"
              ? "bg-[#F3F4F6] text-[#111827]"
              : "text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]"
          )}
        >
          <Settings size={20} strokeWidth={pathname === "/settings" ? 2.5 : 1.75} />
          <span className="tracking-tight">Settings</span>
        </Link>

        {/* Delhi Public School Card with Circular Monkey Avatar */}
        <div className="flex items-center gap-3 p-3.5 rounded-[20px] bg-[#F3F4F6] border border-border/40 shadow-sm">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white border border-border shadow-inner relative flex items-center justify-center">
            <Image
              src="/monkey-avatar.png"
              alt="DPS School Avatar"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#111827] leading-none mb-1 truncate">
              Delhi Public School
            </p>
            <p className="text-[10px] font-medium text-[#6B7280] leading-none">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  );
}
