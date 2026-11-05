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
        ink: {
          DEFAULT: "#1B1B1F",
          light: "#2B2B33",
          subtle: "#45454F",
        },
        ivory: {
          DEFAULT: "#F7F6F2",
          surface: "#F2F0EA",
        },
        lavender: {
          DEFAULT: "#B9A7F2",
          light: "#DDD4FB",
          dark: "#9079D9",
        },
        mint: {
          DEFAULT: "#BFE7DC",
          light: "#E1F6F0",
          dark: "#88CDBE",
        },
        lime: {
          DEFAULT: "#D8F36A",
          dark: "#B5D638",
        },
        coolgray: {
          DEFAULT: "#85858D",
          light: "#A4A4AC",
        },
        bordergray: {
          DEFAULT: "#E7E5E1",
          dark: "#D6D4CE",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Plus Jakarta Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-jakarta)",
          "Plus Jakarta Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
        editorial: [
          "Georgia",
          "Cambria",
          "serif",
        ],
      },
      boxShadow: {
        card: "0 2px 10px rgba(27, 27, 31, 0.04), 0 1px 3px rgba(27, 27, 31, 0.02)",
        hover: "0 12px 30px rgba(27, 27, 31, 0.08), 0 4px 8px rgba(27, 27, 31, 0.04)",
        dropdown: "0 10px 40px rgba(27, 27, 31, 0.12)",
      },
      borderRadius: {
        pill: "9999px",
        editorial: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
