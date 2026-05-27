import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  mobileFab?: boolean;
}

export function FloatingCreateButton({ className, mobileFab }: Props) {
  if (mobileFab) {
    return (
      <Link
        href="/assignments/new"
        className={cn(
          "md:hidden fixed bottom-[88px] right-6 z-50 w-14 h-14 rounded-full bg-white text-[#F97316] border border-[#F97316]/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-[0.95] transition-all",
          className
        )}
        aria-label="Create assignment"
      >
        <Plus size={24} strokeWidth={3} />
      </Link>
    );
  }

  return (
    <div className={cn("hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 justify-center", className)}>
      <Link
        href="/assignments/new"
        className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[#111827] text-white text-sm font-extrabold hover:bg-gray-800 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Plus size={16} strokeWidth={3} />
        Create Assignment
      </Link>
    </div>
  );
}
