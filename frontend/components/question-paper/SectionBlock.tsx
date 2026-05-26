import { Section } from "@/lib/types";
import { QuestionItem } from "./QuestionItem";

export function SectionBlock({ section }: { section: Section }) {
  const parts = section.title.split(/\s*-\s*|\s*–\s*|\s*:\s*/);
  const mainTitle = parts[0] || "Section";
  const subTitle = parts[1] || "";

  return (
    <div className="mb-10 select-none">
      {/* Centered Section Header */}
      <h3 className="font-extrabold text-[#111827] text-center text-lg tracking-wide mb-6">
        {mainTitle}
      </h3>

      {/* Left-Aligned Question Type Sub-Header & Instruction */}
      {subTitle && (
        <h4 className="font-extrabold text-[#111827] text-base leading-none mb-1.5 text-left">
          {subTitle}
        </h4>
      )}
      <p className="text-xs font-semibold text-[#6B7280] italic mb-5 text-left leading-relaxed">
        {section.instruction}
      </p>

      {/* Questions list */}
      <div className="space-y-4">
        {section.questions.map((q) => (
          <QuestionItem key={q.number} question={q} />
        ))}
      </div>
    </div>
  );
}
