/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          50: '#f7fee7',
          100: '#ecfccb',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16', // Standard Lime
          600: '#65a30d',
          700: '#4d7c0f',
        }
      }
    },
  },
  plugins: [],
}
