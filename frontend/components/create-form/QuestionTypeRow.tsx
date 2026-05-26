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
    <div className="relative md:grid md:grid-cols-[1fr_160px_140px_32px] md:gap-3 md:items-start bg-gray-50/80 md:bg-transparent border border-border md:border-0 rounded-xl md:rounded-none p-4 md:p-0 space-y-3 md:space-y-0">
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 md:relative md:top-auto md:right-auto md:flex md:h-10 md:items-center md:justify-center text-text-muted hover:text-red-500"
          aria-label="Remove row"
        >
          <X size={16} />
        </button>
      )}

      <div>
        <p className="text-xs font-medium text-text-secondary mb-1.5 md:sr-only">
          Question Type
        </p>
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
              className="w-full h-10 border border-border rounded-xl px-3 text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer"
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

      <div className="grid grid-cols-2 gap-3 md:contents">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-1.5 md:sr-only">
            No. of Questions
          </p>
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
        <div>
          <p className="text-xs font-medium text-text-secondary mb-1.5 md:sr-only">
            Marks
          </p>
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
    </div>
  );
}
