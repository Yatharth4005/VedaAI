"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  className?: string;
}

export function PageHeader({
  title,
  showBack = true,
  backHref,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-surface border-b border-border/60 sticky top-0 z-20 shrink-0",
        className
      )}
    >
      {/* Left side: Back button & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="w-9 h-9 rounded-full bg-[#F3F4F6] border border-border/40 hover:bg-gray-200 text-[#111827] flex items-center justify-center shrink-0 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
        )}
        <div className="flex items-center gap-2 text-[#6B7280]">
          <LayoutGrid size={18} className="shrink-0" />
          <span className="text-sm font-semibold tracking-tight truncate">
            {title}
          </span>
        </div>
      </div>

      {/* Right side: Notifications & User profile card */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative w-9 h-9 rounded-full hover:bg-gray-100 text-[#6B7280] flex items-center justify-center transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F97316] rounded-full border border-white" />
        </button>

        {/* User Card */}
        <button
          type="button"
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-border/40 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-border overflow-hidden shrink-0 shadow-sm relative">
            <Image
              src="/monkey-avatar.png"
              alt="User Avatar"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <span className="text-sm font-bold text-[#111827] hidden sm:inline tracking-tight">
            John Doe
          </span>
          <ChevronDown size={14} className="text-[#9CA3AF] hidden sm:block shrink-0" />
        </button>
      </div>
    </header>
  );
}
