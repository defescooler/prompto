import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { tokens } from "@/lib/tokens"

export default function AnimatedBlob({
  variant = "circle",
  size = 200,
  speed = 1,
  opacity = 8,
  className,
  ...props
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const baseMotion = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 20 / speed,
        ease: "linear",
        repeat: Infinity
      }
    }
  }

  const reducedMotion = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 8,
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }

  const motion = prefersReducedMotion ? reducedMotion : baseMotion

  const shapeStyles = {
    circle: "rounded-full",
    square: "rounded-xl",
    hex: "rounded-2xl transform rotate-45"
  }

  const gradients = {
    circle: "bg-gradient-to-br from-emerald-400/20 to-lime-500/5",
    square: "bg-gradient-to-tr from-emerald-500/15 to-cyan-400/10", 
    hex: "bg-gradient-to-bl from-lime-400/25 to-emerald-600/8"
  }

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none",
        shapeStyles[variant],
        gradients[variant],
        `opacity-${opacity}`,
        "blur-xl",
        className
      )}
      style={{
        width: size,
        height: size,
      }}
      {...motion}
      {...props}
    />
  )
} 