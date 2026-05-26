"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Calendar, Mic, ArrowLeft, ArrowRight } from "lucide-react";
import {
  createAssignmentSchema,
  CreateAssignmentFormValues,
} from "@/lib/validations";
import { useAssignmentStore } from "@/store/assignmentStore";
import { api } from "@/lib/api";
import { toISODate } from "@/lib/utils";
import { FileUploadZone } from "./FileUploadZone";
import { QuestionTypeRow } from "./QuestionTypeRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/PageHeader";

function newRow() {
  return {
    id: crypto.randomUUID(),
    type: "",
    count: 1,
    marksPerQuestion: 2,
  };
}

export function CreateAssignmentForm() {
  const router = useRouter();
  const setStatus = useAssignmentStore((s) => s.setJobStatus);
  const setId = useAssignmentStore((s) => s.setCurrentId);
  const reset = useAssignmentStore((s) => s.reset);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      subject: "",
      class: "",
      dueDate: "",
      questionTypes: [
        { id: crypto.randomUUID(), type: "Multiple Choice Questions", count: 4, marksPerQuestion: 1 },
        { id: crypto.randomUUID(), type: "Short Questions", count: 3, marksPerQuestion: 2 },
        { id: crypto.randomUUID(), type: "Diagram/Graph-Based Questions", count: 5, marksPerQuestion: 5 },
        { id: crypto.randomUUID(), type: "Numerical Problems", count: 5, marksPerQuestion: 5 },
      ],
      additionalInstructions: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionTypes",
  });

  const watchTypes = watch("questionTypes");
  const totalQ = watchTypes.reduce((s, r) => s + (Number(r.count) || 0), 0);
  const totalM = watchTypes.reduce(
    (s, r) => s + (Number(r.count) || 0) * (Number(r.marksPerQuestion) || 0),
    0
  );

  async function onSubmit(data: CreateAssignmentFormValues) {
    setLoading(true);
    reset();
    try {
      const payload = {
        subject: data.subject || "Mathematics", // default value for figma compliance
        class: data.class || "Class 9", // default value for figma compliance
        dueDate: toISODate(data.dueDate),
        questionTypes: data.questionTypes.map(
          ({ type, count, marksPerQuestion }) => ({
            type,
            count,
            marksPerQuestion,
          })
        ),
        additionalInstructions: data.additionalInstructions,
      };
      const { assignmentId } = await api.assignments.create(payload);
      setId(assignmentId);
      setStatus("pending");
      router.push(`/assignments/${assignmentId}?generating=true`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="shrink-0">
        <PageHeader title="Assignment" showBack={true} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden relative min-h-0">
        {/* Step progress bar indicator */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-6 shrink-0">
          <div className="h-full w-2/5 bg-[#111827] rounded-full" />
        </div>

        {/* Floating White Card Body Wrapper (Scrollable) */}
        <div className="flex-1 bg-surface border border-border/80 rounded-[28px] shadow-sm p-6 md:p-8 space-y-8 overflow-y-auto pb-8 min-h-0">
          {/* Header Title with Green Active Indicator Dot */}
          <div className="border-b border-border/40 pb-5 shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <h2 className="text-lg md:text-xl font-extrabold text-[#111827] tracking-tight">
                Create Assignment
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#6B7280]">
              Set up a new assignment for your students
            </p>
          </div>

          {/* Form Content Body */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#111827] tracking-tight mb-1">
                Assignment Details
              </h3>
              <p className="text-xs font-semibold text-[#9CA3AF] mb-5">
                Basic information about your assignment
              </p>

              {/* Subject & Class input fields */}
              <div className="grid grid-cols-2 gap-5 mb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#111827] uppercase tracking-wider">Subject</Label>
                  <Input
                    placeholder="eg : science"
                    className="rounded-xl h-10 border-border/80 text-sm font-medium text-[#111827] focus:ring-[#F97316]/20 focus:border-[#F97316]"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500">{errors.subject.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#111827] uppercase tracking-wider">Class</Label>
                  <Input
                    placeholder="eg : 8th"
                    className="rounded-xl h-10 border-border/80 text-sm font-medium text-[#111827] focus:ring-[#F97316]/20 focus:border-[#F97316]"
                    {...register("class")}
                  />
                  {errors.class && (
                    <p className="text-xs text-red-500">{errors.class.message}</p>
                  )}
                </div>
              </div>

              {/* Drag and Drop File Upload Zone */}
              <div className="mb-6">
                <FileUploadZone value={file} onChange={setFile} />
              </div>

              {/* Due Date input field with Calendar icon inside */}
              <div className="space-y-1.5 mb-6 relative max-w-sm">
                <Label className="text-xs font-bold text-[#111827] uppercase tracking-wider">Due Date</Label>
                <div className="relative">
                  <Input
                    placeholder="DD-MM-YYYY"
                    className="rounded-xl h-10 pr-11 border-border/80 text-sm font-medium text-[#111827] focus:ring-[#F97316]/20 focus:border-[#F97316]"
                    {...register("dueDate")}
                  />
                  <Calendar
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-xs text-red-500">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Question Types Table section */}
              <div className="space-y-4">
                {/* Column Headers */}
                <div className="grid grid-cols-[1fr_24px_112px_112px] gap-4 text-xs font-extrabold text-[#6B7280] uppercase tracking-wider select-none px-1">
                  <span>Question Type</span>
                  <span />
                  <span className="text-center">No. of Questions</span>
                  <span className="text-center">Marks</span>
                </div>

                {/* Rows container */}
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <QuestionTypeRow
                      key={field.id}
                      index={index}
                      control={control}
                      errors={errors}
                      onRemove={() => remove(index)}
                      canRemove={fields.length > 1}
                    />
                  ))}
                </div>

                {/* Add Row & Summary Statistics footer row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/40">
                  {fields.length < 6 ? (
                    <button
                      type="button"
                      onClick={() => append(newRow())}
                      className="inline-flex items-center gap-2 text-sm font-extrabold text-[#111827] hover:text-[#F97316] transition-colors group select-none"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs group-hover:bg-[#F97316] transition-colors">
                        <Plus size={12} strokeWidth={3} />
                      </span>
                      Add Question Type
                    </button>
                  ) : (
                    <div />
                  )}

                  {/* Summary Stats */}
                  <div className="flex items-center gap-6 text-sm font-bold text-[#6B7280] select-none">
                    <span>
                      Total Questions : <span className="text-[#111827] font-extrabold">{totalQ}</span>
                    </span>
                    <span>
                      Total Marks : <span className="text-[#111827] font-extrabold">{totalM}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information details with mic icon inside */}
              <div className="space-y-1.5 mt-8 relative">
                <Label className="text-xs font-bold text-[#111827] uppercase tracking-wider">Additional Information (For better output)</Label>
                <div className="relative">
                  <Textarea
                    placeholder="e.g Generate a question paper for 3 hour exam duration..."
                    rows={4}
                    className="rounded-[20px] resize-none pr-12 pl-4 py-3 border-border/80 text-sm font-medium text-[#111827] focus:ring-[#F97316]/20 focus:border-[#F97316] leading-relaxed"
                    {...register("additionalInstructions")}
                  />
                  <Mic
                    size={18}
                    className="absolute right-4.5 bottom-4.5 text-[#9CA3AF] cursor-pointer hover:text-[#111827] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button bar at bottom */}
        <div className="flex justify-between items-center gap-4 mt-6 shrink-0 select-none">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full h-11 px-7 gap-2 border-border text-[#6B7280] font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Previous
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-full h-11 px-8 gap-2 bg-[#111827] hover:bg-gray-800 text-white font-extrabold active:scale-[0.98] transition-all shadow-md"
          >
            {loading ? "Generating…" : "Next"}
            {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
          </Button>
        </div>
      </form>
    </div>
  );
}
