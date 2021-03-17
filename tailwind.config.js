module.exports = {
  corePlugins: {
    preflight: false,
  },
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '984px',
      xl: '1200px',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#000000',
      navy: {
        400: '#474DFF',
        500: '#222E46',
        600: '#182035',
        700: '#171E2D',
        800: '#161E2E',
        900: '#101725',
        1000: '#1c1d3f',
      },
      green: {
        100: '#474DFF',
        500: '#32C48D',
      },
      red: {
        400: '#fb6666',
        500: '#E86161',
      },
      yellow: {
        400: '#f4cb5e',
        500: '#FCC945',
      },
      pink: {
        500: '#A667F6',
      },
      gray: {
        100: '#F9FAFB',
        200: '#F6F7FC',
        300: '#E4E7EB',
        400: '#C1C7D4',
        500: '#D2D6DC',
        600: '#8283B2',
        700: '#617095',
      },
      bluegray: {
        100: '#E9EAFF2',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: '#app',
}
