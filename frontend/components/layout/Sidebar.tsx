"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ClipboardList,
  Brain,
  BookOpen,
  Settings,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentStore } from "@/store/assignmentStore";
import { VedaLogo } from "./VedaLogo";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/assignments", icon: ClipboardList, badgeKey: "assignments" as const },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: Brain },
  { label: "My Library", href: "/library", icon: BookOpen, badgeKey: "library" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const assignmentCount = useAssignmentStore((s) => s.assignments.length);

  return (
    <div className="w-[240px] h-full flex flex-col bg-surface border-r border-border shrink-0 shadow-sm">
      <div className="px-5 py-5">
        <VedaLogo />
      </div>

      <div className="px-4 mb-2">
        <Link
          href="/assignments/new"
          className={cn(
            "flex items-center justify-center gap-2 w-full h-10 rounded-xl",
            "bg-cta text-white text-sm font-medium",
            "ring-2 ring-accent/40 ring-offset-1 hover:bg-cta-hover transition-colors"
          )}
        >
          <Plus size={18} />
          Create Assignment
          <Sparkles size={14} className="opacity-80" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, badgeKey }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href));
          const badge =
            badgeKey === "assignments" && assignmentCount > 0
              ? assignmentCount
              : badgeKey === "library"
                ? 32
                : null;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                isActive
                  ? "bg-nav-active-bg text-nav-active-text font-medium"
                  : "text-text-secondary hover:bg-gray-50"
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="flex-1">{label}</span>
              {badge !== null && (
                <span className="bg-accent text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-gray-50"
        >
          <Settings size={18} />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-border/60">
          <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-[10px] font-bold text-accent text-center leading-tight px-0.5">
              DPS
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary leading-snug truncate">
              Delhi Public School
            </p>
            <p className="text-[11px] text-text-muted">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  );
}
