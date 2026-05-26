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
    <div className="w-full select-none">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "border-2 border-dashed rounded-[20px] p-8 md:p-10 text-center cursor-pointer transition-all bg-gray-50/30",
          dragging
            ? "border-[#F97316] bg-[#FFF7ED]"
            : "border-border hover:border-[#F97316]/40"
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
          <div className="flex items-center justify-center gap-3 py-4">
            <FileText size={24} className="text-[#F97316]" />
            <span className="text-sm font-bold text-[#111827] truncate max-w-xs">{value.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Cloud Upload Icon */}
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Upload size={22} className="text-[#6B7280]" />
            </div>
            <p className="text-sm font-extrabold text-[#111827] tracking-tight">
              Choose a file or drag & drop it here
            </p>
            <p className="text-xs font-semibold text-[#9CA3AF] mt-1">
              JPEG, PNG, upto 10MB
            </p>
            <span className="inline-block mt-5 text-xs font-bold border border-border/80 rounded-full px-6 py-2 bg-[#F3F4F6] text-[#6B7280] hover:bg-gray-200 transition-colors shadow-sm">
              Browse Files
            </span>
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-[#9CA3AF] mt-3.5 text-center">
        Upload images of your preferred document/image
      </p>
    </div>
  );
}
