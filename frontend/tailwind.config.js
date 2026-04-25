/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff0f6',
          100: '#ffe3ef',
          200: '#ffc1d9',
          300: '#ff91ba',
          400: '#ff5b96',
          500: '#ff2d77',
          600: '#f0005a',
          700: '#c7004a',
          800: '#a5003e',
          900: '#890036',
        },
        rose: {
          blush: '#FFD6E0',
          soft: '#FFACC7',
          mid: '#FF85A1',
          deep: '#FF4D6D',
        },
        cream: '#FFF5F9',
        mauve: '#C77DFF',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        accent: ['"Satisfy"', 'cursive'],
      },
      backgroundImage: {
        'pink-gradient': 'linear-gradient(135deg, #ff85a1 0%, #ff4d6d 50%, #c77dff 100%)',
        'soft-gradient': 'linear-gradient(180deg, #fff0f6 0%, #ffe3ef 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,133,161,0.15) 0%, rgba(199,125,255,0.15) 100%)',
      },
      boxShadow: {
        pink: '0 4px 24px rgba(255,77,109,0.25)',
        'pink-lg': '0 8px 40px rgba(255,77,109,0.35)',
        soft: '0 2px 16px rgba(255,133,161,0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-pink': 'pulsePink 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulsePink: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,77,109,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,77,109,0)' },
        }
      }
    },
  },
  plugins: [],
};
