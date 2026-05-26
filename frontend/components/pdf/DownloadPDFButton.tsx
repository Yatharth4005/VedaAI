"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { QuestionPaper } from "@/lib/types";
import { QuestionPaperPDF } from "./QuestionPaperPDF";
import { cn } from "@/lib/utils";

interface Props {
  paper: QuestionPaper;
  assignmentId: string;
  variant?: "dark" | "default";
  className?: string;
}

export default function DownloadPDFButton({
  paper,
  assignmentId,
  variant = "default",
  className,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await pdf(<QuestionPaperPDF paper={paper} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `question-paper-${assignmentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "dark") {
    return (
      <>
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          className={cn(
            "hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white text-cta text-sm font-medium hover:bg-gray-100 transition-colors",
            className
          )}
        >
          <Download size={16} />
          {loading ? "Preparing…" : "Download as PDF"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          className={cn(
            "md:hidden w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white",
            className
          )}
          aria-label="Download PDF"
        >
          <Download size={18} />
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-cta text-white text-sm font-medium hover:bg-cta-hover",
        className
      )}
    >
      <Download size={14} />
      {loading ? "Preparing…" : "Download as PDF"}
    </button>
  );
}
