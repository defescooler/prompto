import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { tokens, motionVariants } from "@/lib/tokens"
import { cn } from "@/lib/utils"

export default function Stat({ 
  value, 
  suffix = "", 
  label, 
  icon: Icon,
  className 
}) {
  const ref = useRef(null)
  const counterRef = useRef(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 100, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (counterRef.current) {
        const displayValue = latest.toFixed(value % 1 === 0 ? 0 : 1)
        counterRef.current.textContent = displayValue
      }
    })
  }, [springValue, value])

  return (
    <motion.div
      ref={ref}
      {...(prefersReducedMotion ? motionVariants.fadeInUpReduced : motionVariants.fadeInUp)}
      className={cn("text-center", className)}
    >
      {Icon && (
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/60 backdrop-blur-sm ring-1 ring-white/10">
          <Icon className={tokens.icon.className} />
        </div>
      )}
      
      <div className="mb-2">
        <span 
          ref={counterRef}
          className="font-mono text-5xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
        >
          0
        </span>
        <span className="font-mono text-5xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          {suffix}
        </span>
      </div>
      
      <div className={cn(tokens.colors.text.muted, tokens.typography.body, "text-sm font-medium")}>
        {label}
      </div>
    </motion.div>
  )
} 