import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionTypeRow {
  type: string;
  count: number;
  marksPerQuestion: number;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  class: string;
  dueDate: Date;
  questionTypes: IQuestionTypeRow[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  fileUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    class: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: [
      {
        type: { type: String, required: true },
        count: { type: Number, required: true },
        marksPerQuestion: { type: Number, required: true },
      },
    ],
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    additionalInstructions: { type: String },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    jobId: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>("Assignment", AssignmentSchema);
