/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",   // синий
        accent: "#16A34A",    // зелёный
        danger: "#DC2626",    // красный
      },
    },
  },
  plugins: [],
};
