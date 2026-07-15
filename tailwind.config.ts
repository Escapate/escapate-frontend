import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens (flip with the .light class via CSS variables)
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface-2) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        field: "rgb(var(--field) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        navy: {
          950: "#0C1B2F",
          900: "#11233E",
          800: "#16253F",
          700: "#1E3357",
          600: "#284268",
        },
        orange: {
          DEFAULT: "#E8732A",
          400: "#F0A04B",
          500: "#E8732A",
          600: "#C75C18",
        },
        cream: {
          100: "#EDE7DB",
          50: "#F5F1E9",
        },
        espresso: "#262220",
        wa: "#25D366",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        numeric: ["var(--font-numeric)", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
