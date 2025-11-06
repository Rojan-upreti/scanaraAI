/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette
        apple: {
          blue: '#007AFF',
          blueLight: '#5AC8FA',
          blueDark: '#0051D5',
          gray: {
            50: '#F9F9F9',
            100: '#F2F2F7',
            200: '#E5E5EA',
            300: '#D1D1D6',
            400: '#C7C7CC',
            500: '#AEAEB2',
            600: '#8E8E93',
            700: '#636366',
            800: '#48484A',
            900: '#1C1C1E',
          },
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          green: '#34C759',
          purple: '#AF52DE',
          pink: '#FF2D55',
        },
      },
      borderRadius: {
        'apple': '20px',
        'apple-lg': '28px',
        'apple-xl': '36px',
      },
      boxShadow: {
        'apple': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 8px 30px rgba(0, 0, 0, 0.16)',
        'apple-inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-lg': '40px',
      },
      fontFamily: {
        'apple': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
