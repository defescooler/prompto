import { motion } from "framer-motion"

export default function FeatureCard({ title, blurb, icon: Icon, accent }) {
  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.08, ease: "easeOut" } 
      }}
      className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-md ring-1 ring-white/5 p-8 text-center transition-all duration-200 hover:shadow-xl/20"
    >
      {/* Inner gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 ring-1 ring-emerald-500/20">
          <Icon className="h-8 w-8 text-emerald-400" />
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-white">
          {title}
        </h3>
        
        <p className="text-slate-300 leading-relaxed">
          {blurb}
        </p>
      </div>
    </motion.div>
  )
} 