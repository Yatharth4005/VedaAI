import Link from "next/link";
import { Plus } from "lucide-react";
import { EmptyStateIllustration } from "./EmptyStateIllustration";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-6 text-center flex-1">
      <EmptyStateIllustration />
      <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] mt-8 mb-2 tracking-tight">
        No assignments yet
      </h2>
      <p className="text-[#6B7280] text-sm max-w-md mb-8 leading-relaxed font-medium">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      <Link
        href="/assignments/new"
        className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full bg-[#111827] text-white text-sm font-extrabold hover:bg-gray-855 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={16} strokeWidth={3} />
        Create Your First Assignment
      </Link>
    </div>
  );
}
