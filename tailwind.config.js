/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#13ec37",
        "primary-content": "#0d1b10",
        "background-light": "#f8fcf9",
        "background-dark": "#102213",
        "surface-light": "#e7f3e9",
        "surface-dark": "#1a331f",
      },
      fontFamily: {
        "display": ["Work Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}