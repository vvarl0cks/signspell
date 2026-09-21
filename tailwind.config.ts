import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "Fira Code", "monospace"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Dark backgrounds
        void: "#070709",
        surface: "#0D0D12",
        panel: "#12121A",
        border: "#1E1E2E",
        // Phosphor green accent
        phosphor: {
          DEFAULT: "#00FF8C",
          dim: "#00CC70",
          glow: "#00FF8C33",
        },
        // Amber warning
        amber: {
          DEFAULT: "#FFB347",
          dim: "#CC8A2E",
          glow: "#FFB34733",
        },
        // Text
        ink: {
          high: "#E8E8F0",
          mid: "#9898B0",
          low: "#4A4A60",
        },
        // Status
        success: "#00FF8C",
        danger: "#FF4C6A",
        muted: "#3A3A50",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px 2px #00FF8C33" },
          "50%": { boxShadow: "0 0 24px 8px #00FF8C66" },
        },
        "letter-flash": {
          "0%": { color: "#E8E8F0", transform: "scale(1)" },
          "30%": { color: "#00FF8C", transform: "scale(1.08)" },
          "60%": { color: "#00FF8C" },
          "100%": { color: "#E8E8F0", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bar-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width, 0%)" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        "dot-fill": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "letter-flash": "letter-flash 0.6s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out",
        "scanline": "scanline 8s linear infinite",
        "shake": "shake 0.4s ease-in-out",
        "dot-fill": "dot-fill 0.15s ease-out forwards",
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        "grid-subtle": "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
