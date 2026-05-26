import { z } from "zod";
import { format } from "date-fns";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function formatTodayDMY(): string {
  return format(todayStart(), "dd-MM-yyyy");
}

function parseDMY(val: string): Date | null {
  const parts = val.trim().split("-");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

export const questionTypeRowSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Select a question type"),
  count: z.number().int().min(1, "Min 1").max(50, "Max 50"),
  marksPerQuestion: z.number().int().min(1, "Min 1"),
});

export const createAssignmentSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  class: z.string().min(1, "Class is required"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((v) => parseDMY(v) !== null, {
      message: "Use format DD-MM-YYYY (e.g. 29-05-2026)",
    })
    .refine((v) => {
      const parsed = parseDMY(v);
      return parsed !== null && parsed > todayStart();
    }, {
      message: `Due date must be after today (${formatTodayDMY()}). Check the year.`,
    }),
  questionTypes: z
    .array(questionTypeRowSchema)
    .min(1, "Add at least one question type")
    .max(6, "Maximum 6 types"),
  additionalInstructions: z.string().optional(),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;
