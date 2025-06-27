import { motion } from 'framer-motion'
import { Mic, Video, Info, CheckCircle } from 'lucide-react'

export default function VideoDemo() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section className="relative py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Watch Prompto in Action
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            See how our AI-powered optimization transforms your prompts in real-time
          </p>
        </motion.div>

        {/* Video Call Interface */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Video Placeholder - Space for ScreenStudio Video */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden bg-slate-900/90 backdrop-blur-md border border-slate-700/50 shadow-2xl mb-8"
          >
            {/* Meeting Header - Inverted Colors */}
            <div className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center">
                  <Video className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">⚡ Prompto Live Demo</h3>
                  <p className="text-slate-400 text-sm">Prompt ID #: d2f8-e21c</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">00:00:09</span>
              </div>
            </div>

            {/* Video Area - Placeholder for ScreenStudio Video */}
            <div className="relative aspect-video bg-slate-800/50 flex items-center justify-center min-h-[400px]">
              {/* Participants Avatars */}
              <div className="absolute top-6 right-6 flex gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold border-2 border-slate-600">
                  ES
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold border-2 border-slate-600">
                  SB
                </div>
              </div>

              {/* Video Placeholder Text */}
              <div className="text-center text-white/60">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">ScreenStudio Video Goes Here</p>
                <p className="text-sm text-white/40 mt-2">Replace this placeholder with your video</p>
              </div>

              {/* Current User Prompt */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-700/90 backdrop-blur-md rounded-xl p-4 border border-slate-600/50">
                  <p className="text-white text-lg">
                    Can you shrink this prompt without losing any context?
                  </p>
                </div>
              </div>
            </div>

            {/* Prompto Suggestion Card */}
            <motion.div 
              variants={itemVariants}
              className="absolute bottom-24 right-6 w-80 bg-slate-800/95 backdrop-blur-md rounded-xl p-4 border border-brand-green/30 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                  <span className="text-brand-green font-bold text-sm">P</span>
                </div>
                <span className="text-brand-green font-semibold">Prompto Suggestion</span>
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
              </div>
              <div className="space-y-3 text-white/90 text-sm leading-relaxed">
                <p>✂️ Try removing redundant role phrases.</p>
                <p>• Compress metadata into key-value pairs.</p>
                <p>• Offer an example of a 30% shorter prompt.</p>
              </div>
            </motion.div>

            {/* Control Bar */}
            <div className="flex items-center justify-center gap-4 p-6 bg-slate-800/80 backdrop-blur-md">
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Bottom Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Prompt Summary Card */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Prompt Summary</h4>
                  <p className="text-slate-400 text-sm">Original problem & desired output captured.</p>
                </div>
              </div>
            </div>

            {/* Optimization Insight Card */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Optimization Insight</h4>
                  <p className="text-slate-400 text-sm">Remove 42 tokens by collapsing instructions.</p>
                </div>
              </div>
              <button className="text-brand-green text-sm font-medium hover:text-emerald-400 transition-colors">
                ✓ Apply in builder
              </button>
            </div>

            {/* Best-Practice Tip Card */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-400 text-lg">💡</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Best-Practice Tip</h4>
                  <p className="text-slate-400 text-sm">Place examples after the high-level request for lower cost.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 