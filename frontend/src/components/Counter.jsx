import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

export default function Counter({ value, suffix = "", label, icon: Icon }) {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 100, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        const displayValue = latest.toFixed(0)
        ref.current.textContent = displayValue
      }
    })
  }, [springValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="text-center"
    >
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/60 backdrop-blur-sm ring-1 ring-white/10">
        <Icon className="h-8 w-8 text-emerald-400" />
      </div>
      
      <div className="mb-2">
        <span 
          ref={ref}
          className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
        >
          0
        </span>
        <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          {suffix}
        </span>
      </div>
      
      <div className="text-slate-400 text-sm font-medium">
        {label}
      </div>
    </motion.div>
  )
} 