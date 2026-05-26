import { z } from "zod";

export const questionTypeRowSchema = z.object({
  type: z.string().min(1),
  count: z.number().int().min(1).max(50),
  marksPerQuestion: z.number().int().min(1),
});

export const createAssignmentSchema = z.object({
  subject: z.string().min(1),
  class: z.string().min(1),
  dueDate: z.string().min(1),
  questionTypes: z.array(questionTypeRowSchema).min(1).max(6),
  additionalInstructions: z.string().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
