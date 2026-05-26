"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function StepperInput({
  value,
  onChange,
  min = 1,
  max = 50,
  className,
}: StepperInputProps) {
  const safe = Number.isFinite(value) ? value : min;

  return (
    <div
      className={cn(
        "flex items-center h-9 border border-border rounded-lg bg-surface overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, safe - 1))}
        className="px-2.5 h-full hover:bg-gray-50 text-text-secondary border-r border-border"
        aria-label="Decrease"
      >
        <Minus size={14} />
      </button>
      <span className="flex-1 text-center text-sm font-medium tabular-nums min-w-[2rem]">
        {safe}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, safe + 1))}
        className="px-2.5 h-full hover:bg-gray-50 text-text-secondary border-l border-border"
        aria-label="Increase"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
