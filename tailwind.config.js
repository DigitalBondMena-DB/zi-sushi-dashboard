/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        main: {
          100: "#f9dbd3",
          200: "#f4b7a7",
          300: "#ee937b",
          400: "#e96f4f",
          500: "#e34b23",
          600: "#b63c1c",
          700: "#882d15",
          800: "#5b1e0e",
          900: "#2d0f07",
        },
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
