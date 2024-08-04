/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1a1a1a",
        light: "#fcfcfc",
        midLight: "rgba(252, 252, 252, 0.5)",
        tableDark: "#333333",
        tableLight: "#474747",
        tableBorder: "#323232",
      },
    },
  },
  plugins: [],
};
