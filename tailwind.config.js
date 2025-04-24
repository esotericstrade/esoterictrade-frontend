/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff2fe",
          100: "#e2e6fd",
          200: "#cbd1fa",
          300: "#acb3f5",
          400: "#8b8cee",
          500: "#756ee6",
          600: "#604dd7",
          700: "#5744be",
          800: "#47399a",
          900: "#3d357a",
          950: "#241f47",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
