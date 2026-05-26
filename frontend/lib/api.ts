import { Assignment, QuestionPaper } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const err = (await res.json().catch(() => ({
      error: res.statusText,
    }))) as { error?: string };
    throw new Error(err.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export const api = {
  assignments: {
    list: () => request<Assignment[]>("/api/assignments"),
    get: (id: string) => request<Assignment>(`/api/assignments/${id}`),
    create: (body: object) =>
      request<{ assignmentId: string }>("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    result: (id: string) =>
      request<QuestionPaper>(`/api/assignments/${id}/result`),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/assignments/${id}`, {
        method: "DELETE",
      }),
    regenerate: (id: string) =>
      request<{ success: boolean }>(`/api/assignments/${id}/regenerate`, {
        method: "POST",
      }),
  },
};
