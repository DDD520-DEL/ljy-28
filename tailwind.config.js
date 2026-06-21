/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
      },
    },
    extend: {
      colors: {
        kraft: {
          50: '#FDF8F3',
          100: '#F5F0E8',
          200: '#E8E0D5',
          300: '#D9CCB8',
          400: '#C4956A',
          500: '#B07D4E',
          600: '#8B5E34',
          700: '#6B4523',
          800: '#4A2F18',
          900: '#2D1B0E',
        },
        forest: {
          50: '#F0F5E8',
          100: '#DCE8C8',
          200: '#BFD69A',
          300: '#9CC46B',
          400: '#7DB347',
          500: '#6B8E23',
          600: '#527019',
          700: '#3D5213',
          800: '#2F4F2F',
          900: '#1A2E1A',
        },
        paper: {
          white: '#FDFBF7',
          cream: '#F5F0E8',
          warm: '#EDE5D8',
        }
      },
      fontFamily: {
        display: ['"Noto Serif SC"', '"ZCOOL XiaoWei"', 'serif'],
        body: ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        hand: ['"Ma Shan Zheng"', '"ZCOOL KuaiLe"', 'cursive'],
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(107, 69, 35, 0.1), 0 4px 12px rgba(107, 69, 35, 0.08)',
        'paper-hover': '0 4px 12px rgba(107, 69, 35, 0.15), 0 8px 24px rgba(107, 69, 35, 0.12)',
        'card': '0 2px 8px rgba(139, 94, 52, 0.1), 0 1px 3px rgba(139, 94, 52, 0.06)',
      },
      backgroundImage: {
        'corrugate': "url(\"data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6zm20 0c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z' fill='%23C4956A' fill-opacity='0.08'/%3E%3C/svg%3E\")",
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(107, 142, 35, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(107, 142, 35, 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
