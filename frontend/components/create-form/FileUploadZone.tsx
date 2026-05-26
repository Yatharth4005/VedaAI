"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: File | null;
  onChange: (f: File | null) => void;
}

export function FileUploadZone({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10MB.");
      return;
    }
    onChange(f);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-colors bg-gray-50/50",
          dragging
            ? "border-accent bg-accent-light"
            : "border-border hover:border-accent/40"
        )}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.jpg,.jpeg,.png"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={20} className="text-accent" />
            <span className="text-sm font-medium">{value.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="text-text-muted hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={28} className="text-text-muted mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary">
              Choose a file or drag & drop it here
            </p>
            <p className="text-xs text-text-muted mt-1">
              JPEG, PNG, upto 10MB
            </p>
            <span className="inline-block mt-4 text-sm border border-border rounded-xl px-5 py-2 bg-surface text-text-secondary">
              Browse Files
            </span>
          </>
        )}
      </div>
      <p className="text-xs text-text-muted mt-2 text-center md:text-left">
        Upload images of your preferred document/image
      </p>
    </div>
  );
}
