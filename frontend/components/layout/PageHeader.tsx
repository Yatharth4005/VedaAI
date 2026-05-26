"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  showSparkle?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  showBack = true,
  backHref,
  showSparkle = false,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-surface border-b border-border sticky top-0 z-20",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-text-primary shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-base md:text-lg font-semibold text-text-primary truncate flex items-center gap-1.5">
          {showSparkle && <Sparkles size={16} className="text-accent shrink-0" />}
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-gray-100 text-text-secondary"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 overflow-hidden">
            <span className="w-full h-full flex items-center justify-center text-sm font-semibold text-orange-900">
              J
            </span>
          </div>
          <span className="text-sm font-medium text-text-primary hidden sm:inline">
            John Doe
          </span>
          <ChevronDown size={16} className="text-text-muted hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
