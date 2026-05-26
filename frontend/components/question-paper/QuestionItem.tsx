import { Question } from "@/lib/types";
import { DifficultyInline } from "./DifficultyTag";

export function QuestionItem({ question }: { question: Question }) {
  return (
    <div className="mb-3 text-sm text-text-primary leading-relaxed">
      <p>
        <span className="font-semibold">{question.number}. </span>
        <DifficultyInline difficulty={question.difficulty} /> {question.text}{" "}
        <span className="text-text-muted">
          [{question.marks} Mark{question.marks !== 1 ? "s" : ""}]
        </span>
      </p>
      {question.options && question.options.length > 0 && (
        <div className="mt-2 ml-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {question.options.map((opt) => (
            <p key={opt.label} className="text-text-secondary">
              {opt.label}. {opt.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
