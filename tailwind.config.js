/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '50': '50px',
        '200': '200px',
        '400': '400px',
      },
      margin: {
        '50': '50px',
      },
    }
  },
  plugins: [],
}
