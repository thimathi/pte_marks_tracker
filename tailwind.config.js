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
          bg: '#0b0f19',
          bgDark: '#080c14',
          panel: '#151d2e',
          panel2: '#1c273c',
          border: '#26334d',
          borderLight: '#334155',
          text: '#e2e8f0',
          muted: '#94a3b8',
          accent: '#3b82f6',
          accentHover: '#2563eb',
          pred: '#a855f7',
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
