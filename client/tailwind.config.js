/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf7ed',
          100: '#fde8c7',
          500: '#ff8a1f',
          600: '#ff6f14',
          700: '#e6540b'
        },
        midnight: '#09070f',
        lilac: '#c7b6ff'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(255, 138, 31, 0.14)'
      }
    }
  },
  plugins: []
};
