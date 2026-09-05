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
        obsidian: {
          DEFAULT: '#090B10',
          dark: '#05070A',
        },
        surface: {
          DEFAULT: '#0E121B',
          elevated: '#141A26',
          muted: '#182030',
        },
        slate: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          tertiary: '#64748B',
        },
        cyan: {
          electric: '#22D3EE',
          glow: '#00F2FE',
          400: '#22D3EE',
          500: '#06B6D4',
        },
        indigo: {
          deep: '#6366F1',
          500: '#6366F1',
        },
        status: {
          stable: '#22C55E',
          watch: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        },
        dark: {
          800: '#141A26',
          850: '#0E1420',
          900: '#0B0F19',
          950: '#06090F',
        }
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '18px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card': '0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'glow-cyan-sm': '0 0 12px rgba(6, 182, 212, 0.25)',
        'glow-critical': '0 0 16px rgba(239, 68, 68, 0.30)',
        'glow-amber': '0 0 16px rgba(245, 158, 11, 0.30)',
        'glow-green': '0 0 16px rgba(34, 197, 94, 0.30)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-right': 'slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
