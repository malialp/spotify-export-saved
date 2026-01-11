/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        light: '#fcfcfc',
        midLight: 'rgba(252, 252, 252, 0.5)',
        tableDark: '#333333',
        tableLight: '#474747',
        tableBorder: '#282828',
        spotify: {
          DEFAULT: '#1DB954',
          light: '#1ed760',
          dark: '#1aa34a',
          darker: '#158f3f',
        },
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
