import { AnswerKey } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export function AnswerKeySection({ answers }: { answers: AnswerKey[] }) {
  if (!answers.length) return null;
  return (
    <div className="mt-12 select-none">
      <Separator className="mb-8" />
      <h3 className="font-extrabold text-[#111827] text-lg mb-5 text-left">
        Answer Key:
      </h3>
      <div className="space-y-4">
        {answers.map((a) => (
          <div key={a.number} className="flex gap-3 text-sm">
            <span className="font-extrabold text-[#111827] w-6 flex-shrink-0 text-left">
              {a.number}.
            </span>
            <p className="text-[#6B7280] font-medium leading-relaxed flex-1">{a.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
