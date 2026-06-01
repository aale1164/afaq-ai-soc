import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Security Professional Dark Theme
        dark: {
          950: "#0A0A0A",   // Background main
          900: "#111111",   // Cards & Panels
          800: "#1A1A1A",   // Sidebar & Topbar
          700: "#242424",   // Borders & Hover
        },
        accent: {
          red: "#EF4444",     // Critical Alerts
          orange: "#F97316",  // Warnings
          cyan: "#22D3EE",    // AI & Technology
          emerald: "#10B981", // Online & Success
        },
        neutral: {
          400: "#A1A1AA",
          500: "#71717A",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;