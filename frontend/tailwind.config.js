/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    borderRadius: {
      none: "0px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#FFFFFF",
      accent: "#0057FF",
    },
    extend: {
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0,0,0,1)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Arial", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

