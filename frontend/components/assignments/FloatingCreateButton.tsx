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
          "md:hidden fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-accent",
          className
        )}
        aria-label="Create assignment"
      >
        <Plus size={24} strokeWidth={2.5} />
      </Link>
    );
  }

  return (
    <div className={cn("hidden md:flex justify-center py-8", className)}>
      <Link
        href="/assignments/new"
        className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-cta text-white text-sm font-medium hover:bg-cta-hover shadow-md transition-colors"
      >
        <Plus size={18} />
        Create Assignment
      </Link>
    </div>
  );
}
