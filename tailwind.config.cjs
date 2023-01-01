module.exports = {
  content: ["./src/**/*.{html,js,ts,svelte,md,svx}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      gridTemplateColumns: {
        dynamic: "repeat(auto-fit, minmax(20rem, 1fr))",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: null,
          },
        },
      },
      fontFamily: {
        Nunito: ["Nunito", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
    },
  },
};
