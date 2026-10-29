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
          bg: '#0a0e1a',
          bgDark: '#070a13',
          panel: '#111827',
          panel2: '#162032',
          border: '#1e293b',
          borderLight: '#334155',
          text: '#f1f5f9',
          muted: '#94a3b8',
          accent: '#6366f1',
          accentHover: '#818cf8',
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
