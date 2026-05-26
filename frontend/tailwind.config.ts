import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        "sidebar-bg": "#FFFFFF",
        cta: "#111827",
        "cta-hover": "#1F2937",
        accent: "#F97316",
        "accent-light": "#FFF7ED",
        "nav-active-bg": "#F3F4F6",
        "nav-active-text": "#111827",
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
        "input-bg": "#F9FAFB",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
