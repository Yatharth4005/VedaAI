import { cn } from "@/lib/utils";

export function VedaLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Glossy Orange brand icon with folded geometric ribbon 'V' */}
      <svg
        viewBox="0 0 100 100"
        className="w-9 h-9 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 8px 16px rgba(234, 77, 16, 0.38))"
        }}
      >
        <defs>
          {/* Vibrant glossy orange background gradient */}
          <linearGradient id="veda-orange-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7E40" />
            <stop offset="100%" stopColor="#EA4D10" />
          </linearGradient>

          {/* Under-folded left wing gradient (adds grey/silver shading where it slides underneath the fold) */}
          <linearGradient id="v-left-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Over-folded right wing gradient (bright pure white highlight) */}
          <linearGradient id="v-right-wing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          {/* Drop shadow cast from the overlapping right wing onto the left wing fold */}
          <filter id="ribbon-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="-2.5" dy="3.5" stdDeviation="2" floodColor="#9C2D04" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Orange rounded squircle container */}
        <rect width="100" height="100" rx="28" fill="url(#veda-orange-bg)" />

        {/* Left Wing (Folded Underneath) */}
        <path
          d="M 20 30 H 42 L 54 54 Q 54 78 42 78 Q 33 78 31 71 L 20 30 Z"
          fill="url(#v-left-wing)"
        />

        {/* Right Wing (Folded Over / Overlaps Left Wing) */}
        <path
          d="M 58 30 H 80 L 58 78 H 36 Z"
          fill="url(#v-right-wing)"
          filter="url(#ribbon-shadow)"
        />
      </svg>

      <span className="text-xl font-extrabold text-[#111827] tracking-tight">
        VedaAI
      </span>
    </div>
  );
}
