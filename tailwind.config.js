/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pte: {
          bg: '#0b1020',
          bgDark: '#070b16',
          panel: '#141c31',
          panel2: '#19243d',
          border: '#2b3856',
          borderLight: '#3a4b70',
          text: '#edf2ff',
          muted: '#a9b5d0',
          accent: '#80a7ff',
          accentHover: '#9bb8ff',
          pred: '#ec4899',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
