const colors = require("tailwindcss/colors")
const plugin = require("tailwindcss/plugin")

module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
    "./tailwind-components/**/*.{js,ts,jsx,tsx}",
    "./images/*.{jpg,svg,png,jpeg}",
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      animation: {
        "pulse-once": "pulse 2s linear 1",
      },
      colors: {
        primary: colors.red,
        orange: colors.orange,
        rose: colors.rose,
      },
    },
  },
}
