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
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#1e40af", // A blue color for primary
          secondary: "#10b981", // A green color for secondary
          accent: "#f59e0b", // An amber color for accent
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3b82f6",
          secondary: "#10b981",
          accent: "#f59e0b",
        },
      },
    ],
  },
}