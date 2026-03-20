/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f7ff',
          100: '#e6f3ff',
          200: '#bae0ff',
          300: '#7cc6ff',
          400: '#36a7ff',
          500: '#0088ff',
          600: '#0066ff',
          700: '#0052cc',
          800: '#0040a3',
          900: '#003380'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        noto: ['Noto Sans', 'cursive']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'slide-up': 'slide-up 0.5s ease-out'
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
};
