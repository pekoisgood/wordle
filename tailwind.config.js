/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        correct: "#6aaa64",
        "wrong-position": "#c9b458",
        incorrect: "#787c7e",
        "light-grey": "#d3d6da",
      },
    },
    fontFamily: {
      "nyt-franklin": ["nyt-franklin", "Helvetica", "Arial", "sans-serif"],
    },
  },
  plugins: [],
};
