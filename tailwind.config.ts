import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        secondary: "#84CC16",
        accent: "#3B82F6",
        surface: "#F8FAFC",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        football: "#16A34A",
        basketball: "#EA580C",
        handball: "#2563EB",
        athletisme: "#DC2626",
        autres: "#7C3AED",
        parieurs: "#CA8A04",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
