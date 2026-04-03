/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef8ff",
          100: "#dcf2ff",
          200: "#b2e6ff",
          300: "#6dd3ff",
          400: "#20bdff",
          500: "#00a5ff",
          600: "#0083df",
          700: "#0068b4",
          800: "#005894",
          900: "#004a7d",
          950: "#002e51",
        },
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        openSan: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
