/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "50": "var(--50)",
        "100": "var(--100)",
        "200": "var(--200)",
        "300": "var(--300)",
        "400": "var(--400)",
        "500": "var(--500)",
        "600": "var(--600)",
        "700": "var(--700)",
        "800": "var(--800)",
        "900": "var(--900)",
        "950": "var(--950)",
      },
    },
  },
  plugins: [],
}