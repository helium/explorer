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
      },
      purple: {
        500: '#A667F6',
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
      gray: {
        100: '#d5dcea',
        200: '#9CA9CA',
        300: '#8283B2',
        400: '#66759C',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: '#app',
}
