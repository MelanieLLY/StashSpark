/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-blue': {
          50: '#f0f7fb',
          100: '#e1eff7',
          200: '#cde5f3',
          300: '#a8d4ec',
          400: '#7dbde3',
          500: '#5ca7d8',
          600: '#4a8fc9',
          700: '#3d7ab8',
          800: '#366597',
          900: '#2f5479',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

