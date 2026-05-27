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

function getModel(modelName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });
}

function parseDuration(instructions?: string): number | null {
  if (!instructions) return null;
  const text = instructions.toLowerCase();

  const hourRegex = /(\d+(?:\.\d+)?)\s*(?:hour|hr)s?/i;
  const minuteRegex = /(\d+)\s*(?:minute|min)s?/i;

  const hoursAndMinsRegex = /(\d+)\s*(?:hour|hr)s?\s*(?:and\s*)?(\d+)\s*(?:minute|min)s?/i;
  const hoursAndMinsMatch = text.match(hoursAndMinsRegex);
  if (hoursAndMinsMatch) {
    const hours = parseInt(hoursAndMinsMatch[1], 10);
    const mins = parseInt(hoursAndMinsMatch[2], 10);
    return hours * 60 + mins;
  }

  const hourMatch = text.match(hourRegex);
  const minuteMatch = text.match(minuteRegex);

  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    return Math.round(hours * 60);
  }

  if (minuteMatch) {
    return parseInt(minuteMatch[1], 10);
  }

  return null;
}

function buildPrompt(assignment: IAssignment): string {
  const rows = assignment.questionTypes
    .map(
      (q) =>
        `  - ${q.type}: ${q.count} questions × ${q.marksPerQuestion} marks each`
    )
    .join("\n");

  const parsedDuration = parseDuration(assignment.additionalInstructions);
  const timeMinutes = parsedDuration !== null ? parsedDuration : 90;

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
5. Each answer key entry must be extremely concise
6. All questions must relate to ${assignment.subject} for Class ${assignment.class}
7. Latency Optimization: Keep all question texts, MCQ option texts, and section instructions extremely concise, direct, and brief (under 15 words per question/option). Avoid long context blocks or wordy preambles to minimize model output tokens and response latency.
8. Ultra-Brief Answer Key: Each answer key entry must contain ONLY the direct, exact answer (e.g. for MCQs, just the option letter like "A"; for short/numerical questions, a single short phrase or the exact number like "x = 5" or "Photosynthesis"). Do NOT write long explanations, paragraphs, or step-by-step reasoning. Respond with the absolute minimum words necessary.

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(prompt: string, modelName: string): Promise<string> {
  const model = getModel(modelName);
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

async function callGeminiWithRetry(prompt: string, modelName: string, maxAttempts = 4): Promise<string> {
  let lastError: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await callGemini(prompt, modelName);
    } catch (error: any) {
      lastError = error;
      const isTransient =
        error?.status === 503 ||
        error?.status === 429 ||
        String(error).includes("503") ||
        String(error).includes("high demand") ||
        String(error).includes("Service Unavailable") ||
        String(error).includes("Too Many Requests");

      if (isTransient && attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.warn(
          `[aiService] Gemini call to ${modelName} failed (Attempt ${attempt}/${maxAttempts}) due to transient error. Retrying in ${delay / 1000}s...`
        );
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateQuestionPaper(
  assignment: IAssignment
): Promise<GeneratedPaper> {
  const prompt = buildPrompt(assignment);
  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  console.log(`[aiService] Starting question paper generation with model: ${modelName}...`);
  try {
    const raw = await callGeminiWithRetry(prompt, modelName);
    const parsed = parseJsonResponse(raw);
    return paperSchema.parse(parsed);
  } catch (error: any) {
    console.warn(`[aiService] Primary generation attempt failed. Attempting self-correction...`);
    try {
      const fixPrompt =
        prompt +
        "\n\nYour previous response was invalid. Return ONLY valid JSON matching the exact schema requested.";
      const rawFix = await callGeminiWithRetry(fixPrompt, modelName);
      const parsedFix = parseJsonResponse(rawFix);
      return paperSchema.parse(parsedFix);
    } catch (fixError: any) {
      console.error(`[aiService] Generation failed:`, fixError.message ?? fixError);
      throw new Error(`Failed to generate question paper. Error: ${fixError.message ?? fixError}`);
    }
  }
}
