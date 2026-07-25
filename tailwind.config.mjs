/** @type {import('tailwindcss').Config} */

/**
 * The scales below deliberately point at the CSS custom properties declared in
 * `src/styles/global.css` rather than repeating their values. That stylesheet
 * is the single source of truth for design tokens; this file only exposes them
 * to Tailwind's utility generator, so `tracking-eyebrow` and
 * `letter-spacing: var(--dnm-tracking-eyebrow)` can never drift apart.
 */
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
        helvetica: ["Helvetica", "Arial", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },

      // Height of the fixed navbar. Layout renders `h-nav` as a spacer; the
      // full-bleed dark heroes cancel it with `-mt-nav`.
      spacing: {
        nav: "var(--dnm-nav-h)",
      },

      backgroundImage: {
        "stage-gradient": "var(--dnm-gradient-stage)",
        "brand-text": "var(--dnm-gradient-text)",
      },

      fontSize: {
        eyebrow: "var(--dnm-eyebrow-size)",
        "eyebrow-sm": "var(--dnm-eyebrow-size-sm)",
      },

      letterSpacing: {
        eyebrow: "var(--dnm-tracking-eyebrow)",
        "eyebrow-tight": "var(--dnm-tracking-eyebrow-tight)",
      },

      transitionTimingFunction: {
        signature: "var(--dnm-ease-signature)",
        smooth: "var(--dnm-ease-inout)",
        exit: "var(--dnm-ease-exit)",
      },

      transitionDuration: {
        quick: "var(--dnm-dur-quick)",
        base: "var(--dnm-dur-base)",
        slow: "var(--dnm-dur-slow)",
      },

      // Keyframes live in global.css so the component classes there can share
      // them; these entries only bind them to `animate-*` utilities.
      // `spin-custom` reuses Tailwind's built-in `spin` keyframe — the reverse
      // variant is a direction, not a second set of keyframes.
      animation: {
        marquee: "marqueeScroll 50s linear infinite",
        "spin-custom": "spin 50s linear infinite",
        "spin-custom-reverse": "spin 50s linear infinite reverse",
        orb: "orbFloat 14s ease-in-out infinite alternate",
        blink: "blink 1.1s step-end infinite",
        "border-pulse": "borderPulse 2.5s ease-in-out infinite",
        "scroll-line": "scrollDown 2.5s cubic-bezier(0.77, 0, 0.175, 1) infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
