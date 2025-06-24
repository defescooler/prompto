import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { tokens, motionVariants } from "@/lib/tokens"
import { cn } from "@/lib/utils"

export default function FeatureCard({ title, blurb, icon: Icon, accent, className }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <motion.div
      whileHover={prefersReducedMotion ? motionVariants.cardHoverReduced : motionVariants.cardHover}
      whileTap={prefersReducedMotion ? motionVariants.cardHoverReduced : motionVariants.cardTap}
      className={cn("group motion-safe:hover:scale-105 motion-reduce:hover:scale-100", className)}
    >
      <Card 
        interactive
        className="relative overflow-hidden p-8 text-center"
      >
        {/* Inner gradient on hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          accent || "from-emerald-500/10 to-emerald-500/5"
        )} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 ring-1 ring-emerald-500/20">
            <Icon className={tokens.icon.className} />
          </div>
          
          <h3 className={cn(tokens.typography.title, tokens.colors.text.primary, "mb-3")}>
            {title}
          </h3>
          
          <p className={cn(tokens.colors.text.secondary, "leading-relaxed")}>
            {blurb}
          </p>
        </div>
      </Card>
    </motion.div>
  )
} 