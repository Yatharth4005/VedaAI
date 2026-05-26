"use client";

import { X } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateAssignmentFormValues } from "@/lib/validations";
import { StepperInput } from "@/components/ui/stepper-input";

const QUESTION_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False",
] as const;

interface Props {
  index: number;
  control: Control<CreateAssignmentFormValues>;
  errors: FieldErrors<CreateAssignmentFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionTypeRow({
  index,
  control,
  errors,
  onRemove,
  canRemove,
}: Props) {
  const rowErrors = errors.questionTypes?.[index];

  return (
    <div className="grid grid-cols-[1fr_24px_112px_112px] gap-4 items-center select-none w-full">
      {/* Dropdown Selector */}
      <div className="min-w-0">
        <Controller
          control={control}
          name={`questionTypes.${index}.type`}
          render={({ field }) => (
            <select
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              className="w-full h-10 border border-border/80 rounded-xl px-4.5 text-sm font-semibold bg-surface text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] cursor-pointer transition-all"
            >
              <option value="" disabled>
                Select type…
              </option>
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        />
        {rowErrors?.type && (
          <p className="text-xs text-red-500 mt-1">{rowErrors.type.message}</p>
        )}
      </div>

      {/* Delete X Button between selector and first stepper */}
      <div className="flex justify-center items-center">
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 rounded-full hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 flex items-center justify-center transition-colors"
            aria-label="Remove row"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        ) : (
          <div className="w-6 h-6" /> // spacer
        )}
      </div>

      {/* No. of Questions Stepper */}
      <div className="flex justify-center">
        <Controller
          control={control}
          name={`questionTypes.${index}.count`}
          render={({ field }) => (
            <StepperInput
              value={Number(field.value) || 1}
              onChange={field.onChange}
              min={1}
              max={50}
            />
          )}
        />
      </div>

      {/* Marks Stepper */}
      <div className="flex justify-center">
        <Controller
          control={control}
          name={`questionTypes.${index}.marksPerQuestion`}
          render={({ field }) => (
            <StepperInput
              value={Number(field.value) || 1}
              onChange={field.onChange}
              min={1}
              max={100}
            />
          )}
        />
      </div>
    </div>
  );
}
