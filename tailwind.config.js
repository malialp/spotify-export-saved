/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        dark: "#1a1a1a",
        light: "#fcfcfc",
        midLight: "rgba(252, 252, 252, 0.5)",
      },
    },
  },
  plugins: [],
};
