import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dbeefe",
          500: "#0f8ec7",
          600: "#0b75a5",
          700: "#0a5c82"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
