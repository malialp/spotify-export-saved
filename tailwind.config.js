/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster", "sans-serif"],
      },
      colors: {
        darkgray: "rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
