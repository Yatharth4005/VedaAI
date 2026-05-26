import { AnswerKey } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export function AnswerKeySection({ answers }: { answers: AnswerKey[] }) {
  if (!answers.length) return null;
  return (
    <div className="mt-10">
      <Separator className="mb-6" />
      <h3 className="font-bold text-text-primary text-base mb-4">Answer Key</h3>
      <div className="space-y-3">
        {answers.map((a) => (
          <div key={a.number} className="flex gap-3 text-sm">
            <span className="font-semibold text-text-primary w-6 flex-shrink-0">
              {a.number}.
            </span>
            <p className="text-text-secondary leading-relaxed">{a.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
