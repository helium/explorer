module.exports = {
  mode: 'jit',
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
      blue: {
        400: '#58a7f9',
        500: '#1D91F8',
      },
      'reward-scale': {
        0: '#FF6666',
        0.2: '#FC8745',
        0.4: '#FEA053',
        0.6: '#FCC945',
        0.8: '#9FE14A',
        1: '#29D344',
      },
      navy: {
        50: '#d4d4ff',
        300: '#0008FF',
        400: '#474DFF',
        500: '#222E46',
        600: '#182035',
        700: '#171E2D',
        800: '#161E2E',
        900: '#101725',
        1000: '#1c1d3f',
      },
      purple: {
        50: '#e4d5fd',
        500: '#A667F6',
        700: '#5850EB',
      },
      green: {
        50: '#ccf1e8',
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
        600: '#b97d1d',
      },
      yellow: {
        50: '#f7ebc6',
        400: '#f4cb5e',
        500: '#FCC945',
        600: '#F0BB32',
        700: '#F9BD25',
        800: '#b58714',
      },
      pink: {
        50: '#e3d6fb',
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
      darkgray: {
        800: '#171E2D',
      },
      bluegray: {
        100: '#E9EAFF2',
      },
      reward: {
        witness: '#FFC769',
        challenger: '#BE73FF',
        challengee: '#1d91f8',
        data: 'teal',
        consensus: '#FF6666',
      },
      txn: {
        stake: '#a235fa',
        heartbeat: '#A984FF',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    extend: {
      animation: {
        'bounce-left': 'bounce-left 2s infinite',
        'bounce-right': 'bounce-right 2s infinite',
      },
      keyframes: {
        'bounce-left': {
          '0%, 100%': {
            transform: 'translateX(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'bounce-right': {
          '0%, 100%': {
            transform: 'translateX(25%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      spacing: {
        108: '27rem',
        120: '30rem',
        144: '36rem',
        160: '40rem',
      },
      translate: {
        '120p': '120%',
      },
      height: {
        '5/10': '50vh',
        '4/10': '40vh',
        '6/10': '60vh',
        '8/10': '80vh',
      },
      minHeight: {
        '1/2': '50vh',
        '325px': '325px',
      },
      maxHeight: {
        'vh-minus-nav': 'calc(100vh - 80px)',
        '5/10': '50vh',
        '6/10': '60vh',
        '8/10': '80vh',
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
  important: '#app',
}
