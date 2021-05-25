module.exports = {
  // mode: 'jit',
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
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
    colors: {
      //TODO: get Pete to define a palette and do a full color audit
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
      purple: {
        500: '#A667F6',
        700: '#5850EB',
      },
      green: {
        100: '#474DFF',
        400: '#29D344',
        500: '#32C48D',
      },
      red: {
        400: '#fb6666',
        500: '#E86161',
      },
      orange: {
        300: '#FF9D66',
        400: '#DA8F32',
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
        200: '#F8F8FB',
        300: '#EFF1F9',
        350: '#d5dcea',
        400: '#C1C7D4',
        500: '#D2D6DC',
        525: '#9999C1',
        550: '#9CA9CA',
        600: '#8283B2',
        650: '#717E98',
        700: '#66759C',
        800: '#617095',
      },
      bluegray: {
        100: '#E9EAFF2',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    extend: {
      spacing: {
        '108': '27rem',
        '120': '30rem',
      },
      translate: {
        '120p': '120%',
      },
      height: {
        '6/10': '60vh',
      },
      minHeight: {
        '1/2': '50vh',
        '325px': '325px',
      },
      maxHeight: {
        'vh-minus-nav': 'calc(100vh - 80px)',
        '5/10': '50vh',
        '6/10': '60vh',
        '80p': '80%',
        '90p': '90%',
        '550px': '550px',
        '650px': '650px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: '#app',
}
