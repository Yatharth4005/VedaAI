import { QuestionPaper } from "@/lib/types";
import { StudentInfoSection } from "./StudentInfoSection";
import { SectionBlock } from "./SectionBlock";
import { AnswerKeySection } from "./AnswerKeySection";
import { Separator } from "@/components/ui/separator";

export function QuestionPaperView({ paper }: { paper: QuestionPaper }) {
  const { metadata, sections, answerKey } = paper;
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 md:p-10 max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-base md:text-lg font-bold text-text-primary">
          {metadata.school}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Subject: {metadata.subject}
        </p>
        <p className="text-sm text-text-secondary">Class: {metadata.class}</p>
        <div className="flex justify-between text-sm text-text-secondary mt-3 max-w-lg mx-auto px-2">
          <span>Time Allowed: {metadata.timeAllowed}</span>
          <span>Maximum Marks: {metadata.maxMarks}</span>
        </div>
      </div>
      <Separator className="my-3" />
      <p className="text-xs text-text-secondary italic text-center mb-3">
        All questions are compulsory unless stated otherwise.
      </p>
      <Separator className="mb-4" />
      <StudentInfoSection cls={metadata.class} />
      <Separator className="my-4" />
      {sections.map((section) => (
        <SectionBlock key={section.title} section={section} />
      ))}
      <p className="text-center text-sm text-text-muted italic mt-8">
        End of Question Paper
      </p>
      <AnswerKeySection answers={answerKey} />
    </div>
  );
}
