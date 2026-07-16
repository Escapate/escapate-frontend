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
        // Display / titulares "pase de abordar" en mayúsculas.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Titulares suaves (El local, Testimonios).
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        // Cuerpo.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Etiquetas / eyebrows / códigos de vuelo.
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-.03em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "esc-float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "esc-dash": {
          to: { "stroke-dashoffset": "-600" },
        },
      },
      animation: {
        float: "esc-float 6s ease-in-out infinite",
        dash: "esc-dash 9s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
