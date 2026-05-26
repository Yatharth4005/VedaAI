import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOption {
  label: string;
  text: string;
}

export interface IQuestion {
  number: number;
  text: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  options?: IOption[];
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAnswerKey {
  number: number;
  answer: string;
}

export interface IQuestionPaper extends Document {
  assignmentId: Types.ObjectId;
  metadata: {
    school: string;
    subject: string;
    class: string;
    timeAllowed: string;
    maxMarks: number;
  };
  sections: ISection[];
  answerKey: IAnswerKey[];
  generatedAt: Date;
}

const QuestionPaperSchema = new Schema<IQuestionPaper>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  metadata: {
    school: String,
    subject: String,
    class: String,
    timeAllowed: String,
    maxMarks: Number,
  },
  sections: [
    {
      title: String,
      instruction: String,
      questions: [
        {
          number: Number,
          text: String,
          type: { type: String },
          difficulty: { type: String, enum: ["easy", "medium", "hard"] },
          marks: Number,
          options: [{ label: String, text: String }],
        },
      ],
    },
  ],
  answerKey: [{ number: Number, answer: String }],
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuestionPaper>("QuestionPaper", QuestionPaperSchema);
