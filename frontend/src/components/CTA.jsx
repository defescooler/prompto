import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CTA({ headline, sub, primary, secondary }) {
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2
  }))

  return (
    <section className="relative isolate overflow-hidden py-20 mt-20">
      {/* Skewed top edge */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 transform -rotate-1 origin-left" />
      
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/60 to-purple-900/40" />
      
      {/* Animated sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
          style={{ left: sparkle.left, top: sparkle.top }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div className="relative container mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          {headline}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
        >
          {sub}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-emerald-600/25"
              onClick={() => window.location.href = primary.href}
            >
              {primary.text}
              {primary.icon && <primary.icon className="w-5 h-5 ml-2" />}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"  
              variant="outline"
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-full transition-all duration-200"
              onClick={() => window.location.href = secondary.href}
            >
              {secondary.text}
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-slate-400 mt-6 text-sm"
        >
          No credit card required • Start optimizing immediately
        </motion.p>
      </div>
    </section>
  )
} 