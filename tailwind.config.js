/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This enables dark mode with a class, e.g., adding 'dark' class to the html element.
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
      theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
    themes: ["light", "dark"],
  },
}