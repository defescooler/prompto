// Design Tokens - Centralized design constants for Prompt Copilot
export const tokens = {
  // Color System
  colors: {
    // Page background
    bg: '#0e1629',
    
    // Surface levels for consistent layering
    surface: {
      0: 'bg-[#0e1629]', // Page background
      1: ['bg-white/5', 'backdrop-blur-sm'], // Glass effect  
      2: ['border', 'border-white/5', 'bg-white/3'], // Card backgrounds
    },
    
    // Single accent gradient
    accent: 'from-emerald-400 to-lime-500',
    
    // Text hierarchy
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300', 
      muted: 'text-slate-400',
      accent: 'bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent',
    },
    
    // Border system
    border: {
      subtle: 'border-white/5',
      standard: 'border-white/10',
      accent: 'border-emerald-500/20',
    }
  },

  // Spacing Scale - 8px base unit
  spacing: {
    2: '0.5rem',   // 8px
    4: '1rem',     // 16px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
    48: '12rem',   // 192px
    64: '16rem',   // 256px
  },

  // Typography Scale - Exact specification
  typography: {
    display: 'text-7xl leading-none md:text-8xl',
    headline: 'text-5xl font-semibold',
    title: 'text-3xl font-semibold',
    'body-lg': 'text-lg',
    body: 'text-base',
  },

  // Radius System
  radius: {
    sm: 'rounded-md',
    base: 'rounded-lg', 
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },

  // Motion Constants
  motion: {
    duration: 0.35,
    ease: [0.32, 0.72, 0, 1],
    hover: {
      scale: 1.05,
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
    }
  },

  // Icon System
  icon: {
    size: 24,
    stroke: 1.75,
    className: 'w-6 h-6 stroke-[1.75] text-emerald-400',
  },

  // Layout Constants
  layout: {
    maxWidth: 'max-w-[88rem]',
    container: 'mx-auto px-4 md:px-8',
    section: 'py-24 md:py-32',
  }
}

// CSS-in-JS Motion Variants with reduced motion support
export const motionVariants = {
  cardHover: {
    scale: tokens.motion.hover.scale,
    transition: tokens.motion.hover.transition
  },
  
  cardTap: {
    scale: tokens.motion.tap.scale,
    transition: tokens.motion.tap.transition
  },
  
  // Reduced motion variant for accessibility
  cardHoverReduced: {
    scale: 1,
    transition: { duration: 0 }
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: tokens.motion.duration, ease: tokens.motion.ease }
  },

  // Reduced motion variant
  fadeInUpReduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.15 }
  },

  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Reduced motion variant
  staggerReduced: {
    animate: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.05
      }
    }
  }
} 