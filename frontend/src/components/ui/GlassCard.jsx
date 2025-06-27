import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  ...props 
}) => {
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      y: -8,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  }

  const glowVariants = {
    initial: { opacity: 0.5 },
    hover: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover={hover ? "hover" : "initial"}
      className={cn(
        // Base glassmorphism styles
        'relative overflow-hidden rounded-card',
        'bg-surface-glass backdrop-blur-glass',
        'border border-border-subtle',
        // Enhanced hover state
        hover && 'transition-all duration-300 ease-out',
        hover && 'hover:bg-surface-glass-hover hover:border-border-glow',
        hover && 'hover:shadow-xl hover:shadow-black/20',
        // Optional glow effect
        glow && 'border-glow',
        className
      )}
      {...props}
    >
      {/* Glass gradient overlay */}
      <div className="absolute inset-0 bg-glass-gradient pointer-events-none" />
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-card opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-card border border-brand-green/20 motion-safe:animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Optional enhanced glow effect */}
      {glow && (
        <motion.div
          variants={glowVariants}
          className="absolute -inset-1 rounded-card bg-gradient-to-r from-brand-green/10 via-brand-green-light/10 to-brand-green/10 blur-sm -z-10"
        />
      )}
    </motion.div>
  )
}

export default GlassCard 