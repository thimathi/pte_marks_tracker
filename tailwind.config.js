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
          bg: '#f8fafc',
          bgDark: '#f1f5f9',
          panel: '#ffffff',
          panel2: '#f8fafc',
          border: '#e2e8f0',
          borderLight: '#cbd5e1',
          text: '#0f172a',
          muted: '#64748b',
          accent: '#2563eb',
          accentHover: '#1d4ed8',
          pred: '#db2777',
          success: '#059669',
          warning: '#d97706',
          danger: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
