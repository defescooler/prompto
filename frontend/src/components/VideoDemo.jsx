import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Plus, Sparkles, Settings, Construction, Check, X, ExternalLink, Play, MessageCircle, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VideoDemo() {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [particles, setParticles] = useState([])
  const [typewriterText, setTypewriterText] = useState("")
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [autoPlayStep, setAutoPlayStep] = useState(0)
  const [partyParticles, setPartyParticles] = useState([])
  const [globalPartyParticles, setGlobalPartyParticles] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [commentary, setCommentary] = useState([])
  const [chatBlurred, setChatBlurred] = useState(true)

  const initialPrompt = "How do I start a startup?"
  const enhancedPrompt = `<role>
You are a veteran Y Combinator startup mentor who specializes in advising technical founders.
</role>

<context>
I'm a 20-year-old college student with a working prototype of an AI writing assistant. I've never launched a company before, I have no co-founder, and I only have $500 to invest.
</context>

<task>
Break down the process of launching a pre-seed startup into clear phases:
- Phase 1: Idea validation
- Phase 2: Building an MVP and recruiting a technical cofounder
- Phase 3: First fundraising strategies (targeting $5–10K)
</task>

<format>
Use numbered steps under each phase. Make the advice concise and actionable.
</format>

<tone>
Supportive, motivational, beginner-friendly.
</tone>

<reasoning>
Think step by step before answering.
</reasoning>`

  const commentaryData = [
    {
      id: 'start',
      text: "Watch how Prompto transforms basic prompts",
      icon: MessageCircle,
      side: 'left',
      step: 0,
      delay: 1000
    },
    {
      id: 'typing',
      text: "AI detects your prompt intent automatically",
      icon: Target,
      side: 'right',
      step: 1,
      delay: 2000
    },
    {
      id: 'enhance',
      text: "One-click enhancement with proven techniques",
      icon: Zap,
      side: 'left',
      step: 2,
      delay: 500
    },
    {
      id: 'result',
      text: "Structured prompts get 3x better responses",
      icon: Sparkles,
      side: 'right',
      step: 3,
      delay: 8000
    }
  ]

  const addCommentary = (commentaryId) => {
    const commentaryItem = commentaryData.find(c => c.id === commentaryId)
    if (!commentaryItem) return

    const newComment = {
      ...commentaryItem,
      uniqueId: Date.now() + Math.random()
    }
    
    setCommentary(prev => [...prev, newComment])
    
    setTimeout(() => {
      setCommentary(prev => prev.filter(c => c.uniqueId !== newComment.uniqueId))
    }, 4000)
  }

  const speedDialVariants = {
    closed: {
      scale: 1,
      rotate: 0
    },
    open: {
      scale: 1,
      rotate: 45,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const childVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      y: 0,
      x: 0
    },
    open: (i) => ({
      scale: 1,
      opacity: 1,
      y: Math.sin((220 + i * 50) * Math.PI / 180) * 60,
      x: Math.cos((220 + i * 50) * Math.PI / 180) * 60,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: i * 0.15
      }
    })
  }

  const particleVariants = {
    initial: { scale: 0, opacity: 1, y: 0, x: 0 },
    animate: (i) => ({
      scale: [0, 1.2, 0],
      opacity: [1, 1, 0],
      y: [0, -40 - i * 12],
      x: [0, (i % 2 ? 1 : -1) * (15 + i * 8)],
      transition: { duration: 1.2, ease: "easeOut" }
    })
  }

  const partyParticleVariants = {
    initial: { scale: 0, opacity: 1, y: 0, x: 0, rotate: 0 },
    animate: (i) => ({
      scale: [0, 1.5, 1, 0],
      opacity: [1, 1, 0.9, 0],
      y: [0, -120 - Math.random() * 120],
      x: [0, (Math.random() - 0.5) * 250],
      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1) * 2],
      transition: { 
        duration: 2.5 + Math.random() * 2, 
        ease: "easeOut",
        delay: Math.random() * 0.8
      }
    })
  }

  const globalPartyVariants = {
    initial: { scale: 0, opacity: 1, y: 0, x: 0, rotate: 0 },
    animate: (i) => ({
      scale: [0, 2, 1.2, 0],
      opacity: [1, 1, 0.8, 0],
      y: [0, -250 - Math.random() * 400],
      x: [0, (Math.random() - 0.5) * 500],
      rotate: [0, 720 * (Math.random() > 0.5 ? 1 : -1)],
      transition: { 
        duration: 4 + Math.random() * 3, 
        ease: "easeOut",
        delay: Math.random() * 1.2
      }
    })
  }

  const commentaryVariants = {
    initial: { 
      opacity: 0, 
      x: (side) => side === 'left' ? -100 : 100,
      y: 20,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: (side) => side === 'left' ? -50 : 50,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  }

  const handleEnhance = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      index: i
    }))
    setParticles(newParticles)

    setIsSpeedDialOpen(false)
    setIsEnhancing(true)
    setShowBanner(true)

    setTimeout(() => setParticles([]), 1200)

    setTimeout(() => {
      setIsEnhancing(false)
      setShowCheckmark(true)
      setShowBanner(false)
      setShowOverlay(true)
      
      let i = 0
      const typeInterval = setInterval(() => {
        if (i < enhancedPrompt.length) {
          setTypewriterText(enhancedPrompt.slice(0, i + 1))
          i++
        } else {
          clearInterval(typeInterval)
          if (isPlaying) {
            addCommentary('result')
          }
        }
      }, isPlaying ? 4 : 20)

      setTimeout(() => setShowCheckmark(false), 600)
    }, 1300)
  }

  const handleApply = () => {
    setShowOverlay(false)
    setPromptText(enhancedPrompt)
    setTypewriterText("")
    
    const newPartyParticles = Array.from({ length: 25 }, (_, i) => ({
      id: Date.now() + i,
      index: i,
      emoji: ['🎉', '✨', '🎊', '⭐', '💫', '🌟'][Math.floor(Math.random() * 6)]
    }))
    setPartyParticles(newPartyParticles)
    
    const newGlobalPartyParticles = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + 1000 + i,
      index: i,
      emoji: ['🎉', '✨', '🎊', '⭐', '💫', '🌟', '🎈', '🚀'][Math.floor(Math.random() * 8)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }))
    setGlobalPartyParticles(newGlobalPartyParticles)
    
    setTimeout(() => {
      setPartyParticles([])
      setGlobalPartyParticles([])
    }, 4000)
  }

  const handleCloseOverlay = () => {
    setShowOverlay(false)
    setTypewriterText("")
  }

  const handlePlayDemo = () => {
    setIsPlaying(true)
    setShowPlayButton(false)
    setChatBlurred(false)
    setAutoPlayStep(0)
    addCommentary('start')
  }

  useEffect(() => {
    if (!isPlaying) return

    const runAutoPlay = async () => {
      if (autoPlayStep === 0) {
        setShowCursor(true)
        let i = 0
        const typeInterval = setInterval(() => {
          if (i <= initialPrompt.length) {
            setPromptText(initialPrompt.slice(0, i))
            i++
          } else {
            clearInterval(typeInterval)
            setShowCursor(false)
            addCommentary('typing')
            setTimeout(() => setAutoPlayStep(1), 1000)
          }
        }, 120)
      }
      else if (autoPlayStep === 1) {
        setIsSpeedDialOpen(true)
        setTimeout(() => setAutoPlayStep(2), 1000)
      }
        else if (autoPlayStep === 2) {
        addCommentary('enhance')
        setTimeout(() => {
          handleEnhance()
          setAutoPlayStep(3)
        }, 500)
        }
        else if (autoPlayStep === 3 && showOverlay && typewriterText.length >= enhancedPrompt.length) {
          setTimeout(() => {
            handleApply()
            setAutoPlayStep(4)
        }, 1500)
        }
    }

    const timer = setTimeout(runAutoPlay, 800)
    return () => clearTimeout(timer)
  }, [autoPlayStep, isPlaying, showOverlay, typewriterText.length])

  return (
    <section className="relative py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Play Button Overlay */}
        <AnimatePresence>
          {showPlayButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{ 
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(16px)',
                borderRadius: '2rem'
              }}
            >
              <motion.button
                onClick={handlePlayDemo}
                className="group relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-2xl transition-all duration-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <Play className="w-10 h-10 text-white ml-2" fill="currentColor" />
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/60"
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-teal-400/40"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See Prompto in Action
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Watch how our AI transforms your prompts with intelligent optimization
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Commentary Bubbles */}
          <AnimatePresence>
            {commentary.map((comment) => (
              <motion.div
                key={comment.uniqueId}
                className={`absolute top-1/2 -translate-y-1/2 z-40 ${
                  comment.side === 'left' ? '-left-80' : '-right-80'
                } hidden lg:block`}
                custom={comment.side}
                variants={commentaryVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className={`flex items-center gap-3 ${
                  comment.side === 'right' ? 'flex-row-reverse' : ''
                }`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <comment.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`bg-slate-900/95 backdrop-blur-md border border-emerald-500/20 rounded-2xl px-4 py-3 max-w-64 shadow-xl ${
                    comment.side === 'left' ? 'rounded-bl-sm' : 'rounded-br-sm'
                  }`}>
                    <p className="text-white text-sm font-medium leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Chat Interface Mockup */}
          <div className={`relative rounded-2xl overflow-hidden bg-slate-900/90 backdrop-blur-md border border-slate-700/50 shadow-2xl transition-all duration-700 ${
            chatBlurred ? 'blur-md scale-95 opacity-60' : 'blur-none scale-100 opacity-100'
          }`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">ChatGPT</h3>
                  <p className="text-slate-400 text-sm">AI Assistant</p>
                </div>
              </div>
              <motion.div 
                className="w-2 h-2 bg-emerald-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Chat Input Area */}
            <div className="p-6 bg-slate-800/50">
              <div className="relative">
                <div className="relative">
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="w-full p-4 pr-24 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                    placeholder="Type your prompt here..."
                    rows={3}
                    readOnly
                  />
                  {showCursor && (
                    <motion.span 
                      className="absolute text-white text-lg"
                      style={{
                        left: `${1 + promptText.length * 0.55}rem`,
                      top: '1rem'
                      }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  )}
                </div>
                
                <button className="absolute bottom-3 right-16 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{backgroundColor: '#475569', color: 'white', border: '1px solid #64748b'}}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>

                {/* Prompto FAB */}
                <div className="absolute bottom-3 right-3">
                  <motion.button
                    className="relative w-8 h-8 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                      color: 'white'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={speedDialVariants}
                    animate={isSpeedDialOpen ? "open" : "closed"}
                    onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
                  >
                    <AnimatePresence mode="wait">
                      {showCheckmark ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.4, type: "spring", stiffness: 400 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      ) : isEnhancing ? (
                        <motion.div
                          key="spinner"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        </motion.div>
                      ) : (
                        <motion.div key="plus">
                          <Plus className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {particles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                          custom={particle.index}
                          variants={particleVariants}
                          initial="initial"
                          animate="animate"
                          exit="initial"
                        />
                      ))}
                    </AnimatePresence>

                    <AnimatePresence>
                      {partyParticles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute text-lg pointer-events-none"
                          custom={particle.index}
                          variants={partyParticleVariants}
                          initial="initial"
                          animate="animate"
                          exit="initial"
                        >
                          {particle.emoji}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.button>

                  <AnimatePresence>
                    {isSpeedDialOpen && (
                      <>
                        <motion.button
                          className="absolute w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all group"
                          custom={0}
                          variants={childVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          whileHover={{ scale: 1.15 }}
                          onClick={handleEnhance}
                        >
                          <Sparkles className="w-5 h-5" />
                          <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-700 shadow-xl">
                            Enhance
                          </div>
                        </motion.button>

                        <motion.button
                          className="absolute w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all group"
                          custom={1}
                          variants={childVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          whileHover={{ scale: 1.15 }}
                        >
                          <Settings className="w-5 h-5" />
                          <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-700 shadow-xl">
                            Settings
                          </div>
                        </motion.button>

                        <motion.button
                          className="absolute w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all group cursor-not-allowed opacity-75"
                          custom={2}
                          variants={childVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          <Construction className="w-5 h-5" />
                          <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-700 shadow-xl">
                            Coming Soon
                          </div>
                        </motion.button>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhancement Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl shadow-lg backdrop-blur-md border border-emerald-400/20 z-50"
              initial={{ y: -100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-semibold text-lg">🚀 Enhancing your prompt...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhancement Overlay */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseOverlay}
            >
              <motion.div
                className="bg-slate-900/98 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden"
                initial={{ scale: 0.85, y: 60, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Prompt Enhancement</h3>
                    <button
                      onClick={handleCloseOverlay}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
                      style={{backgroundColor: '#374151', color: 'white', border: '1px solid #4b5563'}}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 p-8 max-h-[55vh] overflow-y-auto">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Original Prompt</h4>
                    <div className="bg-slate-800/60 rounded-2xl p-6 text-slate-300 leading-relaxed border border-slate-700/30">
                      {promptText}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Enhanced Prompt</h4>
                    <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6 text-white leading-relaxed min-h-[200px]">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                      {typewriterText}
                      {typewriterText.length < enhancedPrompt.length && (
                          <motion.span 
                            className="text-emerald-400 text-lg"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          >
                            |
                          </motion.span>
                      )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-700/50 flex justify-end gap-4">
                  <motion.button
                    onClick={handleCloseOverlay}
                    className="px-6 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105"
                    style={{backgroundColor: '#374151', color: 'white', border: '1px solid #4b5563'}}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleApply}
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{background: 'linear-gradient(to right, #10b981, #0d9488)', color: 'white', border: '1px solid rgba(16, 185, 129, 0.3)'}}
                    whileHover={{ y: -2, boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply & Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
                     )}
         </AnimatePresence>

        {/* Global Party Particles */}
        <AnimatePresence>
          {globalPartyParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="fixed text-3xl pointer-events-none z-50"
              style={{
                left: particle.x,
                top: particle.y
              }}
              custom={particle.index}
              variants={globalPartyVariants}
              initial="initial"
              animate="animate"
              exit="initial"
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Go to App Button */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="fixed top-6 right-6 z-50"
        >
          <Button
            onClick={() => window.location.href = '/dashboard'}
            className="group flex items-center gap-3 px-6 py-3 rounded-button bg-black/50 backdrop-blur-md border border-white/20 hover:border-brand-green/40 text-white hover:text-brand-green transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <span>Go to App</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 