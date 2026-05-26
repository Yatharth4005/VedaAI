import { Question } from "@/lib/types";
import { DifficultyInline } from "./DifficultyTag";

export function QuestionItem({ question }: { question: Question }) {
  return (
    <div className="mb-4 text-sm text-[#111827] leading-relaxed select-none">
      <p className="font-semibold">
        <span className="font-extrabold">{question.number}. </span>
        <DifficultyInline difficulty={question.difficulty} /> <span className="font-medium text-[#111827] ml-0.5">{question.text}</span>{" "}
        <span className="text-[#6B7280] font-bold ml-1">
          [{question.marks} Mark{question.marks !== 1 ? "s" : ""}]
        </span>
      </p>
      {question.options && question.options.length > 0 && (
        <div className="mt-2.5 ml-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-semibold text-[#6B7280]">
          {question.options.map((opt) => (
            <p key={opt.label}>
              <span className="font-extrabold text-[#111827] mr-1">{opt.label}.</span> {opt.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
