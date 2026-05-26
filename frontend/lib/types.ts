export interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marksPerQuestion: number;
}

export type Difficulty = "easy" | "medium" | "hard";
export type AssignmentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";
export type JobStatus =
  | "idle"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  questionTypes: Array<{
    type: string;
    count: number;
    marksPerQuestion: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  status: AssignmentStatus;
  createdAt: string;
}

export interface Option {
  label: string;
  text: string;
}

export interface Question {
  number: number;
  text: string;
  type: string;
  difficulty: Difficulty;
  marks: number;
  options?: Option[];
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerKey {
  number: number;
  answer: string;
}

export interface PaperMetadata {
  school: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
}

export interface QuestionPaper {
  _id: string;
  assignmentId: string;
  metadata: PaperMetadata;
  sections: Section[];
  answerKey: AnswerKey[];
  generatedAt: string;
}
