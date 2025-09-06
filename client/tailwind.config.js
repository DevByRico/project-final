/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                            // very important
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: { xs: '360px' },
    },
  },
  plugins: [],
}
