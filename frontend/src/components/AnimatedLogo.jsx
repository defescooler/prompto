import React from 'react'
import { motion } from 'framer-motion'

const AnimatedLogo = ({ className = "text-2xl", showSpark = true }) => {
  return (
    <div className={`font-bold flex items-center gap-1 ${className}`}>
      <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
        promp
      </span>
      <div className="relative">
        <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
          t
        </span>
        {showSpark && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-emerald-400 text-xs">✨</span>
          </motion.div>
        )}
      </div>
      <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
        o
      </span>
    </div>
  )
}

export default AnimatedLogo 