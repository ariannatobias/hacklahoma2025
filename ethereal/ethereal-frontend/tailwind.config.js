/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tranquilBlue: "#b3cde0",
        softLavender: "#cbc3e3",
        warmBeige: "#f7f3e9",
        gentleTeal: "#98ddca",
        deepCharcoal: "#2a2a2a",
      },
      animation: {
        pulseSlow: "pulse 6s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};