import Link from "next/link";
import { Plus } from "lucide-react";
import { EmptyStateIllustration } from "./EmptyStateIllustration";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center min-h-[calc(100vh-12rem)]">
      <EmptyStateIllustration />
      <h2 className="text-xl md:text-2xl font-semibold text-text-primary mt-6 mb-2">
        No assignments yet
      </h2>
      <p className="text-text-secondary text-sm max-w-md mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      <Link
        href="/assignments/new"
        className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-cta text-white text-sm font-medium hover:bg-cta-hover transition-colors shadow-sm"
      >
        <Plus size={18} />
        Create Your First Assignment
      </Link>
    </div>
  );
}
