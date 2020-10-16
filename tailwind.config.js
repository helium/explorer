const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    standardFontWeights: true,
    defaultLineHeights: true,
  },
  purge: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["soleil", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        helium: "#1C1D3F",
        "helium-dark": "#27284B",
        "helium-light": "#3F416D",
      },
    },
  },
  variants: {
    margin: ["responsive", "hover"],
    textColor: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [require("@tailwindcss/ui")],
};
