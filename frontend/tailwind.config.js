/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pillx: {
          black:   "#0A0A0A",
          gold:    "#FFD700",
          purple:  "#7C3AED",
          cyan:    "#06B6D4",
          silver:  "#C0C0C0",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "monospace"],
        body:    ["var(--font-inter)",    "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":    "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
        "premium-gradient": "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        "common-gradient":  "linear-gradient(135deg, #374151 0%, #6B7280 100%)",
        "hero-gradient":    "radial-gradient(ellipse at center, #1a0533 0%, #0A0A0A 70%)",
      },
    },
  },
  plugins: [],
};
