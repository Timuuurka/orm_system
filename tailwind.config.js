/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,tsx}"], // Ensure Tailwind applies styles in JSX files
    theme: {
      extend: {
        fontFamily: {
          sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        },
        colors: {
          primary: {
            DEFAULT: "#2563eb",
            light: "#3b82f6",
            dark: "#1e40af",
          },
          dark: {
            bg: "#0f172a",
            card: "#1e293b",
            text: "#f8fafc",
          },
        },
      },
    },
    plugins: [],
  };
  