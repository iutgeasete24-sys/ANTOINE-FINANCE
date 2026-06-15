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
        ink: "#F7F8F4",
        graphite: "#A9B0AD",
        mist: "#1C211F",
        paper: "#111614",
        night: "#070908",
        glass: "rgba(255, 255, 255, 0.07)",
        line: "rgba(255, 255, 255, 0.1)",
        mint: "#4FD69C",
        amber: "#E4A94F",
        rose: "#F17486"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(0, 0, 0, 0.32)",
        glow: "0 0 40px rgba(79, 214, 156, 0.14)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
