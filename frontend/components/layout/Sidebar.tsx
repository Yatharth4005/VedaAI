"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  PieChart,
  Settings,
  Sparkle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentStore } from "@/store/assignmentStore";
import { VedaLogo } from "./VedaLogo";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/home", icon: LayoutGrid },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/assignments", icon: FileText, badgeKey: "assignments" as const },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: BookOpen },
  { label: "My Library", href: "/library", icon: PieChart, badgeKey: "library" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const assignmentCount = useAssignmentStore((s) => s.assignments.length);

  return (
    <div className="w-[260px] h-full flex flex-col bg-surface border border-border/80 rounded-[24px] shadow-sm shrink-0 overflow-hidden py-6 px-4">
      {/* Brand Logo Header */}
      <div className="px-3 mb-6">
        <VedaLogo />
      </div>

      {/* Double-Ringed Create Assignment Button */}
      <div className="px-2 mb-6">
        <Link
          href="/assignments/new"
          className={cn(
            "flex items-center justify-center gap-2 w-full h-11 rounded-full",
            "bg-[#111827] text-white text-sm font-bold shadow-md",
            "ring-[2.5px] ring-[#F97316] ring-offset-2 ring-offset-white border border-[#F97316]/40",
            "hover:bg-gray-800 transition-all active:scale-[0.98]"
          )}
        >
          <Sparkle size={15} fill="white" className="text-white" />
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
              : badgeKey === "library"
                ? 32
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
