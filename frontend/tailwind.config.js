/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./configuracoes.html",
    "./assets/js/**/*.js",
    "./assets/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta personalizada da marca Lore Achadinhos
        primary: "#ff66b2",   // Rosa vibrante e moderno
        secondary: "#ffe6f2", // Rosa claro, suave
        accent: "#ffd1dc",    // Rosa pastel
        dark: "#2d2d2d",      // Contraste elegante
        light: "#ffffff",
      },
      fontFamily: {
        sans: ["Poppins", "Helvetica", "Arial", "sans-serif"],
        display: ["Montserrat", "Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.05)",
        glow: "0 0 15px rgba(255,102,178,0.4)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
