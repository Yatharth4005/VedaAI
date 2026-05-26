import { Section } from "@/lib/types";
import { QuestionItem } from "./QuestionItem";

export function SectionBlock({ section }: { section: Section }) {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-text-primary text-center uppercase text-sm mb-2">
        {section.title}
      </h3>
      <p className="text-xs text-text-secondary text-center italic mb-4">
        {section.instruction}
      </p>
      {section.questions.map((q) => (
        <QuestionItem key={q.number} question={q} />
      ))}
    </div>
  );
}
