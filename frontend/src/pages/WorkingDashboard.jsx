import React, { useState, useContext, useMemo, useCallback, memo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Coins, Trophy, User, LogOut, AlertCircle } from 'lucide-react'
import { AuthContext } from '../App.jsx'
// import './dashboard-optimizations.css' // Temporarily commented out for troubleshooting

// Performance optimization constants at the top
const ANIMATION_CONFIG = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.8
}

const HOVER_SCALE = 1.02
const TAP_SCALE = 0.98

// Will-change optimization for better performance
const optimizedStyles = {
  transform: 'translateZ(0)', // Force hardware acceleration
  willChange: 'transform, opacity'
}

// Error Boundary Component
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
          <div className="text-center max-w-md p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
            <p className="text-slate-400 mb-6">Something went wrong. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Optimized Stat Card Component
const StatCard = memo(({ icon: Icon, title, value, subtitle, gradient, onClick }) => {
  // Type validation and defensive defaults
  const safeIcon = (typeof Icon === 'function') ? Icon : Sparkles
  const safeTitle = (typeof title === 'string' && title.length > 0) ? title : 'Unknown'
  const safeValue = (value !== null && value !== undefined) ? value : 0
  const safeSubtitle = (typeof subtitle === 'string') ? subtitle : ''
  const safeGradient = (typeof gradient === 'string' && gradient.length > 0) ? gradient : 'from-slate-600 to-slate-800'

  const handleClick = useCallback(() => {
    if (onClick && typeof onClick === 'function') {
      try {
        onClick()
      } catch (error) {
        console.error('StatCard onClick error:', error)
      }
    }
  }, [onClick])

  return (
    <motion.div
      whileHover={{ scale: HOVER_SCALE, y: -2 }}
      whileTap={{ scale: TAP_SCALE }}
      transition={ANIMATION_CONFIG}
      className={`bg-gradient-to-br ${safeGradient} border-0 shadow-2xl cursor-pointer group overflow-hidden relative rounded-2xl`}
      onClick={handleClick}
      style={optimizedStyles}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">{safeTitle}</p>
            <p className="text-white text-2xl font-bold mb-1">{safeValue}</p>
            {safeSubtitle && <p className="text-white/60 text-xs">{safeSubtitle}</p>}
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <safeIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  )
})

// Optimized Prompt Card Component
const PromptCard = memo(({ prompt, onCopy }) => {
  // Robust prompt validation with fallbacks
  const safePrompt = useMemo(() => {
    if (!prompt || typeof prompt !== 'object') {
      return {
        id: Math.random().toString(36),
        title: 'Untitled Prompt',
        body: 'No content available',
        effectiveness_score: 0
      }
    }
    
    return {
      id: prompt.id || Math.random().toString(36),
      title: (typeof prompt.title === 'string' && prompt.title.trim()) ? prompt.title.trim() : 'Untitled Prompt',
      body: (typeof prompt.body === 'string' && prompt.body.trim()) ? prompt.body.trim() : 'No content available',
      effectiveness_score: (typeof prompt.effectiveness_score === 'number' && !isNaN(prompt.effectiveness_score)) 
        ? Math.max(0, Math.min(10, prompt.effectiveness_score)) 
        : 0
    }
  }, [prompt])

  const handleCopy = useCallback(async () => {
    if (onCopy && typeof onCopy === 'function') {
      try {
        await onCopy(safePrompt.body, safePrompt.id)
      } catch (error) {
        console.error('Copy error:', error)
      }
    }
  }, [onCopy, safePrompt.body, safePrompt.id])

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600/50 hover:border-emerald-500/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white truncate flex-1 mr-2">{safePrompt.title}</h3>
        <span className="text-emerald-400 text-sm bg-emerald-500/20 px-2 py-1 rounded whitespace-nowrap">
          {Number(safePrompt.effectiveness_score).toFixed(1)}/10
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{safePrompt.body}</p>
      <button 
        onClick={handleCopy}
        className="text-slate-400 hover:text-emerald-400 text-xs transition-colors"
      >
        Copy to clipboard
      </button>
    </div>
  )
})

function WorkingDashboard() {
  const authContext = useContext(AuthContext)
  const { user, logout } = authContext || { user: null, logout: () => {} }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState(null)

  // Optimized mock data with memoization
  const stats = useMemo(() => ({
    totalPrompts: 15,
    avgScore: 8.7,
    tokensSaved: 2847,
    masteryLevel: 2
  }), [])

  const prompts = useMemo(() => [
    {
      id: 1,
      title: "Creative Writing Prompt",
      body: "Write a short story about...",
      effectiveness_score: 8.5
    },
    {
      id: 2,
      title: "Data Analysis Request", 
      body: "Analyze the following dataset...",
      effectiveness_score: 9.2
    }
  ], [])

  // Optimized copy function with error handling
  const copyToClipboard = useCallback(async (text, promptId) => {
    try {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (!successful) throw new Error('Fallback copy failed')
      } else {
        await navigator.clipboard.writeText(text)
      }
      setCopySuccess(promptId)
      setTimeout(() => setCopySuccess(null), 2000)
      setError(null)
    } catch (err) {
      console.error('Copy failed:', err)
      setError(`Failed to copy: ${err.message}`)
    }
  }, [])

  // Optimized logout handler
  const handleLogout = useCallback(async () => {
    try {
      setLoading(true)
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      setError('Failed to logout. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [logout])

  // Safe user display
  const safeUser = useMemo(() => ({
    username: user?.username || 'User',
    email: user?.email || ''
  }), [user])

  // Cleanup effects for memory optimization
  useEffect(() => {
    // Auto-clear copy success after 2 seconds
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  useEffect(() => {
    // Auto-clear errors after 5 seconds
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Error display component
  const ErrorDisplay = memo(() => {
    if (!error) return null
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mx-8 mb-4 bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-200"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            ×
          </button>
        </div>
      </motion.div>
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center dashboard-container">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full loading-spinner mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden text-white dashboard-container">
      <ErrorDisplay />
      
      {/* Header */}
      <div className="flex items-center justify-between p-8 pb-4">
        <div className="flex items-center gap-6">
          <div className="text-3xl font-bold text-emerald-400">Prompto</div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent">
              Welcome back, {safeUser.username}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-400 text-sm">
                  Level {Number(stats.masteryLevel) || 1} Prompt Master
                </span>
              </div>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, ((stats.totalPrompts % 10) / 10) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: HOVER_SCALE }}
          whileTap={{ scale: TAP_SCALE }}
          onClick={handleLogout}
          disabled={loading}
          className="h-12 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-2xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <User className="w-5 h-5 text-slate-400" />
          )}
          <span className="text-white font-medium">{safeUser.username}</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 mb-8">
        <StatCard
          icon={Sparkles}
          title="Total Prompts"
          value={Number(stats.totalPrompts) || 0}
          subtitle="enhanced"
          gradient="from-emerald-600 to-emerald-800"
        />
        
        <StatCard
          icon={TrendingUp}
          title="Avg Score"
          value={`${Number(stats.avgScore || 0).toFixed(1)}/10`}
          subtitle="effectiveness"
          gradient="from-blue-600 to-blue-800"
        />
        
        <StatCard
          icon={Coins}
          title="Tokens Saved"
          value={`${(Number(stats.tokensSaved || 0) / 1000).toFixed(1)}K`}
          subtitle="optimization"
          gradient="from-purple-600 to-purple-800"
        />
        
        <StatCard
          icon={Trophy}
          title="Mastery Level"
          value={Number(stats.masteryLevel) || 1}
          subtitle="prompt master"
          gradient="from-orange-600 to-orange-800"
        />
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prompt Terminal */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Prompt Terminal
            </h2>
            <textarea 
              className="w-full h-40 bg-slate-950/50 border border-slate-600/50 rounded-xl p-4 text-white resize-none font-mono text-sm backdrop-blur-sm focus:border-emerald-500/50 transition-all"
              placeholder="Enter your prompt here..."
            />
            <button className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-emerald-500/25">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Enhance Prompt
            </button>
          </div>

          {/* Recent Prompts */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Recent Prompts</h2>
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt} 
                  onCopy={copyToClipboard}
                />
              ))}
              {copySuccess && (
                <div className="text-center text-emerald-400 text-sm">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapped with Error Boundary and optimizations
const OptimizedDashboard = memo(() => (
  <DashboardErrorBoundary>
    <WorkingDashboard />
  </DashboardErrorBoundary>
))

OptimizedDashboard.displayName = 'OptimizedDashboard'

export default OptimizedDashboard 