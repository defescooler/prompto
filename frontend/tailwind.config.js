/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Hey Nomi-inspired design tokens
      colors: {
        surface: {
          glass: 'rgba(15, 23, 42, 0.65)',
          'glass-hover': 'rgba(15, 23, 42, 0.8)',
          dark: '#0f172a',
          darker: '#020617',
        },
        border: {
          glow: 'rgba(34, 197, 94, 0.25)',
          'glow-strong': 'rgba(34, 197, 94, 0.4)',
          subtle: 'rgba(148, 163, 184, 0.1)',
        },
        brand: {
          green: '#22c55e',
          'green-light': '#4ade80',
          'green-dark': '#16a34a',
        },
        particle: {
          primary: 'rgba(255, 255, 255, 0.6)',
          secondary: 'rgba(148, 163, 184, 0.4)',
          glow: 'rgba(34, 197, 94, 0.3)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'nebula-gradient': 'radial-gradient(ellipse at top, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 1) 100%)',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-strong': '20px',
      },
      // Enhanced spacing for better rhythm
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
        '74': '18.5rem',
        '78': '19.5rem',
        '82': '20.5rem',
        '86': '21.5rem',
        '90': '22.5rem',
        '94': '23.5rem',
        '98': '24.5rem',
      },
      // Enhanced typography for better hierarchy
      fontSize: {
        'hero': ['clamp(3rem, 9vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      // Standardized border radius - 12px across all components
      borderRadius: {
        'card': '12px',
        'button': '9999px', // fully rounded buttons
        'input': '12px',
      },
      // Animation and transition utilities
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'particle': 'particle 20s linear infinite',
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) translateX(0px)' },
          '100%': { transform: 'translateY(-100px) translateX(100px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Motion preferences for accessibility
      screens: {
        'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
        'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
      },
    },
  },
  plugins: [
    // Glassmorphism utilities
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 32px rgba(0, 0, 0, 0.3)',
        },
        '.glass-strong': {
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 48px rgba(0, 0, 0, 0.4)',
        },
        '.glass-hover': {
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          },
        },
        '.text-glow': {
          textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
        },
        '.border-glow': {
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(34, 197, 94, 0.2)',
        },
        // Motion-safe utilities
        '.motion-safe\\:animate-float': {
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'float 6s ease-in-out infinite',
          },
        },
        '.motion-safe\\:animate-glow': {
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'glow 2s ease-in-out infinite alternate',
          },
        },
        '.motion-reduce\\:animate-none': {
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        },
      })
    }
  ],
} 