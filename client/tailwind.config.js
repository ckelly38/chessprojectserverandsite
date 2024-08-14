/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,jsx,ts,tsx,css}',
    './public/index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}

