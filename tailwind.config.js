/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F7F8F7',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#0F5E52',
          50: '#E6F0EE',
          100: '#CCE1DD',
          200: '#99C3BB',
          300: '#66A599',
          400: '#338777',
          500: '#0F5E52',
          600: '#0C4B42',
          700: '#093831',
          800: '#062521',
          900: '#031210',
        },
        text: '#14201D',
        accent: {
          DEFAULT: '#C97A3D',
          50: '#FDF8F3',
          100: '#FAF1E7',
          200: '#F5E3CF',
          300: '#EBD5B7',
          400: '#E1C79F',
          500: '#C97A3D',
          600: '#A16231',
          700: '#7A4A25',
          800: '#523119',
          900: '#2A180F',
        },
        success: {
          DEFAULT: '#0F5E52',
          50: '#E6F4F0',
          100: '#CCE9E1',
          500: '#0F5E52',
        },
        warning: {
          DEFAULT: '#D97706',
          50: '#FFF8EB',
          100: '#FEF3C7',
          500: '#D97706',
        },
        error: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FECACA',
          500: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Consolas', 'monospace'],
      },
      animation: {
        'in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
