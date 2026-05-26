import { cn } from "@/lib/utils";

export function VedaLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#9B2C2C] via-[#DD6B20] to-[#ED8936] flex items-center justify-center shadow-md">
        <span className="text-white font-extrabold text-base tracking-wide">V</span>
      </div>
      <span className="text-xl font-extrabold text-[#111827] tracking-tight">
        VedaAI
      </span>
    </div>
  );
}
