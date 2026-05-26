export function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-40 md:w-56 md:h-44 shrink-0 select-none"
      aria-hidden
    >
      {/* Soft circular backing shadow */}
      <circle cx="110" cy="80" r="55" fill="#F3F4F6" />

      {/* Left side curly loop doodle */}
      <path
        d="M60 45 C45 60, 25 80, 40 92 C55 104, 60 65, 48 55"
        stroke="#1E293B"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Top right floating info card */}
      <rect
        x="135" y="42"
        width="38"
        height="22"
        rx="6"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />
      <circle cx="143" cy="53" r="3" fill="#A78BFA" />
      <rect x="150" y="51" width="16" height="4" rx="1.5" fill="#E2E8F0" />

      {/* Document Sheet */}
      <rect
        x="75"
        y="46"
        width="54"
        height="76"
        rx="8"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="2"
      />
      {/* Document lines representing text */}
      <rect x="85" y="60" width="34" height="4" rx="2" fill="#1E293B" />
      <rect x="85" y="72" width="28" height="4" rx="2" fill="#E2E8F0" />
      <rect x="85" y="84" width="32" height="4" rx="2" fill="#E2E8F0" />
      <rect x="85" y="96" width="22" height="4" rx="2" fill="#E2E8F0" />

      {/* Dark blue dot on right */}
      <circle cx="165" cy="92" r="3.5" fill="#3B82F6" />

      {/* Sparkle star on bottom-left */}
      <path
        d="M80 118 Q84 118 84 114 Q84 118 88 118 Q84 118 84 122 Q84 118 80 118 Z"
        fill="#2563EB"
      />

      {/* Magnifying Glass (floating over document) */}
      {/* Handle */}
      <line
        x1="126"
        y1="102"
        x2="156"
        y2="132"
        stroke="#C4B5FD"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Lens Frame */}
      <circle
        cx="110"
        cy="86"
        r="24"
        fill="white"
        fillOpacity="0.35"
        stroke="#7C3AED"
        strokeWidth="3.5"
      />
      {/* Red 'X' inside Lens */}
      <path
        d="M102 78 L118 94 M118 78 L102 94"
        stroke="#EF4444"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
