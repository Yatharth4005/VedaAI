import { Router, Request, Response } from "express";
import multer from "multer";
import { createAssignmentSchema } from "../lib/validation";
import Assignment from "../models/Assignment";
import QuestionPaper from "../models/QuestionPaper";
import { assignmentQueue } from "../queues/assignmentQueue";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const body =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body;
    const data = createAssignmentSchema.parse(body);

    const totalQuestions = data.questionTypes.reduce((s, r) => s + r.count, 0);
    const totalMarks = data.questionTypes.reduce(
      (s, r) => s + r.count * r.marksPerQuestion,
      0
    );

    const assignment = await Assignment.create({
      title: `Assignment – ${data.subject}`,
      subject: data.subject,
      class: data.class,
      dueDate: new Date(data.dueDate),
      questionTypes: data.questionTypes,
      totalQuestions,
      totalMarks,
      additionalInstructions: data.additionalInstructions,
      fileUrl: req.file ? req.file.originalname : undefined,
      status: "pending",
    });

    const job = await assignmentQueue.add("generate", {
      assignmentId: String(assignment._id),
    });
    await Assignment.findByIdAndUpdate(assignment._id, { jobId: job.id });

    res.status(201).json({ assignmentId: String(assignment._id) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad request";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (_req, res) => {
  const assignments = await Assignment.find().sort({ createdAt: -1 });
  res.json(assignments);
});

router.get("/:id", async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ error: "Not found" });
  res.json(assignment);
});

router.get("/:id/result", async (req, res) => {
  const paper = await QuestionPaper.findOne({
    assignmentId: req.params.id,
  });
  if (!paper) return res.status(404).json({ error: "Not ready yet" });
  res.json(paper);
});

router.delete("/:id", async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  await QuestionPaper.findOneAndDelete({ assignmentId: req.params.id });
  res.json({ success: true });
});

router.post("/:id/regenerate", async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ error: "Not found" });

  await QuestionPaper.findOneAndDelete({ assignmentId: req.params.id });
  await Assignment.findByIdAndUpdate(req.params.id, {
    status: "pending",
    errorMessage: undefined,
  });

  const job = await assignmentQueue.add("generate", {
    assignmentId: req.params.id,
  });
  await Assignment.findByIdAndUpdate(req.params.id, { jobId: job.id });

  res.json({ success: true });
});

export default router;
