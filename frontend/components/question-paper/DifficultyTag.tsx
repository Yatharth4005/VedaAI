import { Difficulty } from "@/lib/types";

const LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Moderate",
  hard: "Challenging",
};

export function difficultyLabel(d: Difficulty): string {
  return LABELS[d] ?? "Easy";
}

/** Inline bracket label for Figma question line: [Easy] */
export function DifficultyInline({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="font-medium text-text-primary">
      [{difficultyLabel(difficulty)}]
    </span>
  );
}
