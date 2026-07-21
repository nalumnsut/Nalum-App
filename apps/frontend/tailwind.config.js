/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#fcf9f9",
        foreground: "#231f20",
        card: "#ffffff",
        border: "#ded6d7",
        maroon: "#7a1f35",
        muted: "#79747e",
      },
    },
  },
  plugins: [],
};
