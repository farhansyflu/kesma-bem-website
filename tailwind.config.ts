import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0d2a38", light: "#0d2f3a" },
        gold: { DEFAULT: "#f8d24a", soft: "#fde480", light: "#fbde6e" },
        cream: "rgb(var(--cream) / <alpha-value>)",
        paper: "#fffbef",
        teal: "#227863",
        ink: "rgb(var(--ink) / <alpha-value>)",
        mute: "rgb(var(--mute) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          fg: "rgb(var(--primary-fg) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -14px rgba(13,42,56,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
