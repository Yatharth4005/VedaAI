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
        "flex items-center justify-between w-28 h-9 border border-border/80 rounded-full bg-[#F9FAFB] px-1 overflow-hidden select-none shrink-0",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, safe - 1))}
        className="w-7 h-7 rounded-full hover:bg-gray-200 text-[#6B7280] flex items-center justify-center transition-colors outline-none"
        aria-label="Decrease"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="text-sm font-extrabold text-[#111827] tabular-nums text-center w-8 select-none">
        {safe}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, safe + 1))}
        className="w-7 h-7 rounded-full hover:bg-gray-200 text-[#6B7280] flex items-center justify-center transition-colors outline-none"
        aria-label="Increase"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
