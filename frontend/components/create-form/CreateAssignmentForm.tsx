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
      questionTypes: [newRow()],
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
        subject: data.subject,
        class: data.class,
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
        <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-cta rounded-full" />
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 rounded-full" />
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 md:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Create Assignment
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Set up a new assignment for your students
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Assignment Details
          </h3>
          <p className="text-xs text-text-secondary mb-4 -mt-2">
            Basic information about your assignment
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <Label className="text-xs">Subject</Label>
              <Input
                placeholder="eg : science"
                className="rounded-xl h-10"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Class</Label>
              <Input
                placeholder="eg : 8th"
                className="rounded-xl h-10"
                {...register("class")}
              />
              {errors.class && (
                <p className="text-xs text-red-500">{errors.class.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <FileUploadZone value={file} onChange={setFile} />
          </div>

          <div className="space-y-1.5 mb-6">
            <Label>Due Date</Label>
            <div className="relative">
              <Input
                placeholder="DD-MM-YYYY"
                className="rounded-xl h-10 pr-10"
                {...register("dueDate")}
              />
              <Calendar
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
            {errors.dueDate && (
              <p className="text-xs text-red-500">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-[1fr_160px_140px_32px] gap-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
              <span>Question Type</span>
              <span>No. of Questions</span>
              <span>Marks</span>
              <span />
            </div>
            <div className="space-y-3">
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
            {fields.length < 6 && (
              <button
                type="button"
                onClick={() => append(newRow())}
                className="flex items-center gap-1.5 text-sm text-accent font-medium mt-2"
              >
                <Plus size={16} />
                Add Question Type
              </button>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-6 pt-4 text-sm font-semibold text-text-primary">
              <span>
                Total Questions:{" "}
                <span className="text-text-secondary font-normal">{totalQ}</span>
              </span>
              <span>
                Total Marks:{" "}
                <span className="text-text-secondary font-normal">{totalM}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5 mt-6 relative">
            <Label>Additional Information (For better output)</Label>
            <Textarea
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              rows={4}
              className="rounded-xl resize-none pr-10"
              {...register("additionalInstructions")}
            />
            <Mic
              size={18}
              className="absolute right-3 bottom-3 text-text-muted"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4 mt-6 px-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl h-11 px-5 gap-2 border-border"
        >
          <ArrowLeft size={16} />
          Previous
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl h-11 px-6 gap-2 min-w-[120px]"
        >
          {loading ? "Generating…" : "Next"}
          {!loading && <ArrowRight size={16} />}
        </Button>
      </div>
    </form>
  );
}
