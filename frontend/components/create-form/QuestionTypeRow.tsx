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
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden flex flex-col bg-white border border-border/60 rounded-[24px] p-5 shadow-sm space-y-4 w-full">
        {/* Dropdown Header with Delete Button */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 min-w-0">
            <Controller
              control={control}
              name={`questionTypes.${index}.type`}
              render={({ field }) => (
                <div className="relative">
                  <select
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="w-full h-11 border border-border/60 rounded-xl pl-4 pr-10 text-sm font-bold bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827] cursor-pointer appearance-none transition-all"
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
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            />
            {rowErrors?.type && (
              <p className="text-xs text-red-500 mt-1">{rowErrors.type.message}</p>
            )}
          </div>

          {/* Delete Button */}
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="w-8 h-8 rounded-full border border-border/60 hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 flex items-center justify-center shrink-0 transition-colors"
              aria-label="Remove row"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Steppers in 2-Column Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* No. of Questions */}
          <div className="bg-[#F3F4F6]/50 border border-border/30 rounded-2xl p-3 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 select-none truncate w-full text-center">
              No. of Questions
            </span>
            <Controller
              control={control}
              name={`questionTypes.${index}.count`}
              render={({ field }) => (
                <StepperInput
                  value={Number(field.value) || 1}
                  onChange={field.onChange}
                  min={1}
                  max={50}
                  className="w-full border-none bg-transparent px-0"
                />
              )}
            />
          </div>

          {/* Marks */}
          <div className="bg-[#F3F4F6]/50 border border-border/30 rounded-2xl p-3 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 select-none truncate w-full text-center">
              Marks
            </span>
            <Controller
              control={control}
              name={`questionTypes.${index}.marksPerQuestion`}
              render={({ field }) => (
                <StepperInput
                  value={Number(field.value) || 1}
                  onChange={field.onChange}
                  min={1}
                  max={100}
                  className="w-full border-none bg-transparent px-0"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Desktop Table Row Layout */}
      <div className="hidden md:grid grid-cols-[1fr_24px_112px_112px] gap-4 items-center select-none w-full">
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
                className="w-full h-10 border border-border/80 rounded-xl px-4.5 text-sm font-semibold bg-surface text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827] cursor-pointer transition-all"
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
    </>
  );
}
