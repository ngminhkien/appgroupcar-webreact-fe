import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        error: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        }
      }
    },
  },
  plugins: [
    tailwindAnimate,
  ],
}
