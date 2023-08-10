/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent": "var(--accent)",
        "700": "var(--700)",
        "600": "var(--600)",
        "800": "var(--800)",
        "900": "var(--900)",
        "950": "var(--950)",
      },
    },
  },
  plugins: [],
}