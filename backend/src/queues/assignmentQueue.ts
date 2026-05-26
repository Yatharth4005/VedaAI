import { Queue } from "bullmq";
import { redis } from "../lib/redis";

export interface AssignmentJobData {
  assignmentId: string;
}

export const assignmentQueue = new Queue<AssignmentJobData>(
  "assignment-generation",
  { connection: redis }
);
