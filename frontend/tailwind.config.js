module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // Consistent spacing scale (8px base unit)
      spacing: {
        '2': '0.5rem',   // 8px
        '4': '1rem',     // 16px  
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '12': '3rem',    // 48px
        '16': '4rem',    // 64px
        '24': '6rem',    // 96px
        '32': '8rem',    // 128px
        '48': '12rem',   // 192px
        '64': '16rem',   // 256px
      },
      // Typography utilities
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
      },
      // Add motion-safe utilities for accessibility  
      screens: {
        'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
        'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
      },
    },
  },
  plugins: [
    // Add motion-safe plugin for accessibility
    function({ addUtilities }) {
      addUtilities({
        '.motion-safe\\:animate-pulse': {
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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