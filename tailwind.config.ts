import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15231D",
        graphite: "#66736C",
        mist: "#E8EDE9",
        paper: "#FFFFFF",
        night: "#F5F7F4",
        glass: "rgba(21, 35, 29, 0.04)",
        line: "rgba(21, 35, 29, 0.1)",
        mint: "#188B62",
        amber: "#B77418",
        rose: "#C65361"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(28, 45, 36, 0.08)",
        glow: "0 10px 28px rgba(24, 139, 98, 0.14)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
