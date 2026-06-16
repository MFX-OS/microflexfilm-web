import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#020509",
        ink: {
          DEFAULT: "#06121d",
          900: "#020509",
          800: "#061421",
          700: "#0c2133",
          600: "#102a40",
        },
        navy: {
          DEFAULT: "#071624",
          900: "#020509",
          800: "#061421",
          700: "#071624",
          600: "#0c2133",
          500: "#102a40",
        },
        cyan: {
          DEFAULT: "#00d8f2",
          400: "#34e3f5",
          500: "#00d8f2",
          600: "#00a8cf",
          700: "#0087a8",
        },
        mist: "#f5f9fb",
        paper: {
          DEFAULT: "#f7fbff",
          50: "#ffffff",
          100: "#f5f9fb",
          200: "#e1ebf2",
        },
        muted: {
          DEFAULT: "#a9b9c8",
          light: "#bdd0dc",
          dark: "#6e8294",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.075em",
        widest: "0.22em",
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "42px",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      boxShadow: {
        deep: "0 34px 90px rgba(0,0,0,.48)",
        soft: "0 24px 70px rgba(2,12,24,.18)",
        cyan: "0 16px 40px rgba(0,216,242,.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
