import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { IAssignment } from "../models/Assignment";

const optionSchema = z.object({ label: z.string(), text: z.string() });
const questionSchema = z.object({
  number: z.number(),
  text: z.string(),
  type: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  marks: z.number(),
  options: z.array(optionSchema).optional(),
});
const sectionSchema = z.object({
  title: z.string(),
  instruction: z.string(),
  questions: z.array(questionSchema),
});
const answerKeySchema = z.object({ number: z.number(), answer: z.string() });
const paperSchema = z.object({
  metadata: z.object({
    school: z.string(),
    subject: z.string(),
    class: z.string(),
    timeAllowed: z.string(),
    maxMarks: z.number(),
  }),
  sections: z.array(sectionSchema),
  answerKey: z.array(answerKeySchema),
});

export type GeneratedPaper = z.infer<typeof paperSchema>;

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });
}

function buildPrompt(assignment: IAssignment): string {
  const rows = assignment.questionTypes
    .map(
      (q) =>
        `  - ${q.type}: ${q.count} questions × ${q.marksPerQuestion} marks each`
    )
    .join("\n");

  const timeMinutes = Math.max(30, Math.round(assignment.totalMarks * 1.2));

  return `Create a question paper with these exact requirements:
School: Delhi Public School, Sector-4, Bokaro
Subject: ${assignment.subject}
Class: ${assignment.class}
Total Marks: ${assignment.totalMarks}
Time Allowed: ${timeMinutes} minutes

Question types and counts:
${rows}

Additional instructions: ${assignment.additionalInstructions || "None"}

Rules:
1. Group questions by type into sections (MCQ → Section A, Short → Section B, Long → Section C, etc.)
2. Difficulty distribution: 40% easy, 40% medium, 20% hard
3. For MCQ: include 4 options with labels A, B, C, D as objects { "label": "A", "text": "..." }
4. Total marks across all questions must exactly equal ${assignment.totalMarks}
5. Each answer key entry must be concise
6. All questions must relate to ${assignment.subject} for Class ${assignment.class}

Respond with ONLY this JSON structure (no markdown):
{
  "metadata": {
    "school": "Delhi Public School, Sector-4, Bokaro",
    "subject": "${assignment.subject}",
    "class": "${assignment.class}",
    "timeAllowed": "${timeMinutes} minutes",
    "maxMarks": ${assignment.totalMarks}
  },
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions.",
      "questions": [
        {
          "number": 1,
          "text": "Question text",
          "type": "MCQ",
          "difficulty": "easy",
          "marks": 1,
          "options": [
            { "label": "A", "text": "option 1" },
            { "label": "B", "text": "option 2" },
            { "label": "C", "text": "option 3" },
            { "label": "D", "text": "option 4" }
          ]
        }
      ]
    }
  ],
  "answerKey": [{ "number": 1, "answer": "Correct answer" }]
}`;
}

function parseJsonResponse(raw: string): unknown {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function callGemini(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "You are an expert Indian school exam paper designer. Output ONLY valid JSON matching the exact schema provided. No markdown. No explanation.\n\n" +
              prompt,
          },
        ],
      },
    ],
  });
  return result.response.text();
}

export async function generateQuestionPaper(
  assignment: IAssignment
): Promise<GeneratedPaper> {
  const prompt = buildPrompt(assignment);

  try {
    const raw = await callGemini(prompt);
    return paperSchema.parse(parseJsonResponse(raw));
  } catch (firstError) {
    console.warn("Gemini first attempt failed, retrying:", firstError);
    const fixPrompt =
      prompt +
      "\n\nYour previous response was invalid JSON. Return ONLY valid JSON, nothing else.";
    const raw = await callGemini(fixPrompt);
    return paperSchema.parse(parseJsonResponse(raw));
  }
}
