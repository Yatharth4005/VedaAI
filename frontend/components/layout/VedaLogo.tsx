import { cn } from "@/lib/utils";

export function VedaLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">V</span>
      </div>
      <span className="text-lg font-bold text-text-primary tracking-tight">
        Veda<span className="text-accent">AI</span>
      </span>
    </div>
  );
}
