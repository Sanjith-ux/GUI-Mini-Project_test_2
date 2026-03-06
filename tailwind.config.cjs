/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0b',
        smoke: '#141417',
        mist: '#f2f3f6',
        accent: '#0ea5e9',
        citron: '#e7ff6b',
      },
      boxShadow: {
        glow: '0 0 30px rgba(14, 165, 233, 0.35)',
      },
    },
  },
  plugins: [],
}
