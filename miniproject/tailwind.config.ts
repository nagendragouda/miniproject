import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5EFE7',
        'cream-light': '#FBF8F3',
        'cream-dark': '#E8DED5',
        primary: '#4F46E5',
        'primary-light': '#6366F1',
        secondary: '#3B82F6',
        'secondary-light': '#60A5FA',
        accent: '#059669',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-dark': '#F1F5F9',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        border: '#E2E8F0',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        info: '#0284C7',
        'space-dark': '#0F172A',
        'space-darker': '#020617',
        'glass-bg': 'rgba(255,255,255,0.65)',
        'glass-border': 'rgba(148,163,184,0.35)',
        'slate-100-dark': '#E2E8F0',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)',
        card: '0 6px 18px rgba(15, 23, 42, 0.07)',
        glow: '0 0 20px rgba(14, 165, 233, 0.5)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
      animation: {
        blob: 'blob 7s infinite',
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.8s ease-out',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'scale-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config