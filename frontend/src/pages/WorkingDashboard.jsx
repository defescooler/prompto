import React, { useState, useCallback, useMemo, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  TrendingUp, 
  Coins, 
  Trophy, 
  User, 
  Copy, 
  Check, 
  AlertCircle,
  ChevronDown,
  LogOut,
  BookOpen,
  Settings,
  CheckCircle,
  Zap,
  Send,
  RotateCcw
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Footer from '@/components/ui/footer'
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

const PromptoLogo = ({ className = "" }) => (
  <svg width="120" height="26" viewBox="0 0 1146 248" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M177.371 190.096V46.041H212.094V80.7836H212.941V190.096H177.371ZM212.941 114.961L209.271 80.7836C212.658 68.5436 218.398 59.2225 226.491 52.82C234.583 46.4176 244.276 43.2164 255.567 43.2164C259.52 43.2164 262.343 43.593 264.036 44.3462V77.959C263.095 77.5824 261.778 77.3941 260.084 77.3941C258.39 77.2058 256.32 77.1116 253.874 77.1116C240.135 77.1116 229.878 80.1245 223.103 86.1503C216.328 92.1762 212.941 101.78 212.941 114.961Z" fill="currentColor"/>
    <path d="M351.482 192.92C336.238 192.92 322.782 189.719 311.114 183.317C299.634 176.914 290.694 168.064 284.296 156.765C277.897 145.279 274.698 132.191 274.698 117.503C274.698 102.815 277.897 89.9165 284.296 78.8064C290.694 67.6963 299.634 59.0342 311.114 52.82C322.782 46.4176 336.238 43.2164 351.482 43.2164C366.915 43.2164 380.371 46.4176 391.851 52.82C403.331 59.0342 412.27 67.6963 418.669 78.8064C425.068 89.9165 428.267 102.815 428.267 117.503C428.267 132.191 424.974 145.279 418.387 156.765C411.988 168.064 403.049 176.914 391.569 183.317C380.089 189.719 366.726 192.92 351.482 192.92ZM351.482 164.392C359.01 164.392 365.785 162.509 371.808 158.743C377.83 154.788 382.535 149.327 385.923 142.36C389.31 135.204 391.004 126.825 391.004 117.221C391.004 103.098 387.24 91.9878 379.712 83.8907C372.372 75.7935 362.962 71.7449 351.482 71.7449C340.002 71.7449 330.498 75.7935 322.97 83.8907C315.442 91.9878 311.678 103.098 311.678 117.221C311.678 126.825 313.372 135.204 316.76 142.36C320.336 149.327 325.041 154.788 330.875 158.743C336.897 162.509 343.766 164.392 351.482 164.392Z" fill="currentColor"/>
    <path d="M454.431 190.096V46.041H489.153V79.9362H490V190.096H454.431ZM551.259 190.096V97.1663C551.259 88.6925 549.094 82.4784 544.766 78.5239C540.625 74.3812 534.697 72.3098 526.981 72.3098C520.206 72.3098 513.995 73.9104 508.349 77.1116C502.703 80.3128 498.187 84.8322 494.799 90.6697C491.6 96.5072 490 103.286 490 111.007L486.33 77.959C491.223 67.4138 498.281 59.0342 507.502 52.82C516.724 46.4176 527.451 43.2164 539.684 43.2164C554.364 43.2164 565.938 47.4533 574.407 55.9271C582.876 64.2126 587.11 74.9461 587.11 88.1276V190.096H551.259ZM648.087 190.096V97.1663C648.087 88.6925 646.016 82.4784 641.876 78.5239C637.736 74.3812 631.807 72.3098 624.091 72.3098C617.128 72.3098 610.823 73.9104 605.177 77.1116C599.531 80.3128 595.109 84.8322 591.909 90.6697C588.71 96.5072 587.11 103.286 587.11 111.007L580.9 77.959C585.605 67.4138 592.756 59.0342 602.354 52.82C611.952 46.4176 623.056 43.2164 635.665 43.2164C650.721 43.2164 662.484 47.5475 670.953 56.2096C679.61 64.6834 683.938 75.9818 683.938 90.1048V190.096H648.087Z" fill="currentColor"/>
    <path d="M802.336 192.92C788.597 192.92 777.399 189.719 768.742 183.317C760.273 176.726 755.004 167.687 752.934 156.2L755.756 155.918V248H720.187V46.041H754.91V78.5239L752.087 77.959C754.721 67.2255 760.744 58.7517 770.154 52.5376C779.564 46.3235 791.044 43.2164 804.594 43.2164C817.391 43.2164 828.495 46.3235 837.905 52.5376C847.503 58.5634 854.937 67.1314 860.206 78.2415C865.476 89.3516 868.111 102.439 868.111 117.503C868.111 132.756 865.382 146.032 859.924 157.33C854.466 168.629 846.844 177.385 837.058 183.599C827.272 189.813 815.698 192.92 802.336 192.92ZM793.302 163.544C804.782 163.544 813.91 159.59 820.685 151.681C827.46 143.584 830.848 132.285 830.848 117.786C830.848 103.286 827.366 92.082 820.403 84.1731C813.627 76.2642 804.5 72.3098 793.02 72.3098C781.728 72.3098 772.6 76.3584 765.637 84.4556C758.674 92.3645 755.192 103.569 755.192 118.068C755.192 132.568 758.674 143.772 765.637 151.681C772.6 159.59 781.822 163.544 793.302 163.544Z" fill="currentColor"/>
    <path d="M957.134 192.92C939.443 192.92 926.363 188.778 917.894 180.492C909.614 172.018 905.473 159.402 905.473 142.642V13.2756L941.325 0V143.49C941.325 150.457 943.207 155.636 946.971 159.025C950.735 162.415 956.663 164.109 964.756 164.109C967.955 164.109 970.778 163.921 973.225 163.544C975.86 162.979 978.306 162.32 980.564 161.567V189.248C978.306 190.378 975.107 191.226 970.966 191.79C966.826 192.544 962.215 192.92 957.134 192.92ZM877.808 74.0046V46.041H980.564V74.0046H877.808Z" fill="currentColor"/>
    <path d="M1068.25 192.92C1053.01 192.92 1039.55 189.719 1027.88 183.317C1016.4 176.914 1007.47 168.064 1001.07 156.765C994.668 145.279 991.468 132.191 991.468 117.503C991.468 102.815 994.668 89.9165 1001.07 78.8064C1007.47 67.6963 1016.4 59.0342 1027.88 52.82C1039.55 46.4176 1053.01 43.2164 1068.25 43.2164C1083.69 43.2164 1097.14 46.4176 1108.62 52.82C1120.1 59.0342 1129.04 67.6963 1135.44 78.8064C1141.84 89.9165 1145.04 102.815 1145.04 117.503C1145.04 132.191 1141.74 145.279 1135.16 156.765C1128.76 168.064 1119.82 176.914 1108.34 183.317C1096.86 189.719 1083.5 192.92 1068.25 192.92ZM1068.25 164.392C1075.78 164.392 1082.56 162.509 1088.58 158.743C1094.6 154.788 1099.31 149.327 1102.69 142.36C1106.08 135.204 1107.77 126.825 1107.77 117.221C1107.77 103.098 1104.01 91.9878 1096.48 83.8907C1089.14 75.7935 1079.73 71.7449 1068.25 71.7449C1056.77 71.7449 1047.27 75.7935 1039.74 83.8907C1032.21 91.9878 1028.45 103.098 1028.45 117.221C1028.45 126.825 1030.14 135.204 1033.53 142.36C1037.11 149.327 1041.81 154.788 1047.65 158.743C1053.67 162.509 1060.54 164.392 1068.25 164.392Z" fill="currentColor"/>
    <mask id="mask0_579_80" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="40" width="151" height="208">
      <path d="M83.352 192.084C69.4181 192.084 58.0611 188.848 49.2808 182.376C40.6915 175.714 35.347 166.578 33.2474 154.967L36.1105 154.681V247.76H0.0351562V43.6149H35.2515V76.4494L32.3884 75.8784C35.0607 65.0287 41.1687 56.4632 50.7124 50.1818C60.2561 43.9005 71.8995 40.7598 85.6425 40.7598C98.622 40.7598 109.884 43.9005 119.427 50.1818C129.162 56.2729 136.701 64.9336 142.046 76.1639C147.39 87.3942 150.063 100.623 150.063 115.851C150.063 131.269 147.295 144.688 141.76 156.109C136.224 167.529 128.494 176.38 118.568 182.662C108.643 188.943 96.9041 192.084 83.352 192.084ZM74.19 162.39C85.8333 162.39 95.0908 158.393 101.962 150.398C108.834 142.214 112.269 130.793 112.269 116.136C112.269 101.48 108.738 90.1542 101.676 82.1598C94.8044 74.1653 85.547 70.168 73.9037 70.168C62.4512 70.168 53.1938 74.2605 46.1314 82.4453C39.069 90.4398 35.5379 101.765 35.5379 116.422C35.5379 131.078 39.069 142.404 46.1314 150.398C53.1938 158.393 62.5466 162.39 74.19 162.39Z" fill="black"/>
    </mask>
    <g mask="url(#mask0_579_80)">
      <rect x="35.1328" y="38.291" width="36.0826" height="87.3578" fill="#0DA30D"/>
      <rect x="74.0625" y="33.5439" width="36.0826" height="90.2064" fill="#0DA30D"/>
      <rect x="112.996" y="28.7959" width="36.0826" height="64.5688" fill="#51D071"/>
      <rect x="106.348" y="95.2637" width="50.3257" height="42.7294" fill="#0DA30D"/>
      <rect x="112.996" y="139.893" width="37.0321" height="51.2752" fill="#51D071"/>
      <rect x="75.0156" y="114.255" width="35.133" height="89.2569" fill="#0DA30D"/>
      <rect x="35.1328" y="114.255" width="37.0321" height="86.4083" fill="#0DA30D"/>
    </g>
    <rect y="165" width="36" height="40" fill="#005F16"/>
    <rect y="125.649" width="35.133" height="37.9817" fill="#005F16"/>
    <rect y="84.8193" width="35.133" height="37.9817" fill="#005F16"/>
    <rect y="43.9883" width="35.133" height="37.9817" fill="#005F16"/>
    <rect y="207.31" width="36.0826" height="37.9817" fill="#005F16"/>
  </svg>
)

function WorkingDashboard() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  
  // Performance optimization constants
  const HOVER_SCALE = 1.02
  const TAP_SCALE = 0.98

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

  // Initialize component
  useEffect(() => {
    setLoading(false)
  }, [])

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
      setIsUserMenuOpen(false)
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

  // Handle prompt enhancement
  const handleEnhancePrompt = useCallback(async () => {
    if (!promptText.trim()) {
      setError('Please enter a prompt to enhance')
      return
    }

    setIsEnhancing(true)
    setError(null)

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock enhanced prompt
      const enhanced = `Enhanced version: ${promptText}\n\nThis enhanced prompt provides more clarity and specific instructions for better AI responses. It includes context, desired format, and clear expectations.`
      
      setEnhancedPrompt(enhanced)
      setError(null)
    } catch (err) {
      console.error('Enhancement failed:', err)
      setError('Failed to enhance prompt. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }, [promptText])

  // Clear prompt terminal
  const clearPrompt = useCallback(() => {
    setPromptText('')
    setEnhancedPrompt('')
    setError(null)
  }, [])

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
      <div className="flex flex-col items-center justify-center p-8 pb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
          className="mb-4 transition-all duration-200 hover:drop-shadow-lg cursor-pointer"
        >
          <PromptoLogo className="w-32 h-8 text-emerald-400" />
        </motion.button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent">
            Welcome back, {safeUser.username}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
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

        <div className="absolute top-8 right-8">
          <div className="relative">
            <motion.button
              whileHover={{ scale: HOVER_SCALE }}
              whileTap={{ scale: TAP_SCALE }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              disabled={loading}
              className="h-12 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-2xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-white font-medium">{safeUser.username}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-emerald-500/30 rounded-lg shadow-2xl shadow-emerald-500/20 z-50"
                  style={{ top: '100%' }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
            
            <div className="space-y-4">
              <textarea 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full h-40 bg-slate-950/50 border border-slate-600/50 rounded-xl p-4 text-white resize-none font-mono text-sm backdrop-blur-sm focus:border-emerald-500/50 transition-all focus:outline-none"
                placeholder="Enter your prompt here..."
                disabled={isEnhancing}
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !promptText.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isEnhancing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Enhance Prompt
                    </>
                  )}
                </button>
                
                <button 
                  onClick={clearPrompt}
                  disabled={isEnhancing}
                  className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
              
              {enhancedPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <h3 className="text-emerald-400 font-medium mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Enhanced Prompt
                  </h3>
                  <div className="bg-slate-950/50 border border-emerald-500/30 rounded-xl p-4 relative">
                    <pre className="text-emerald-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                      {enhancedPrompt}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(enhancedPrompt, 'enhanced')}
                      className="absolute top-3 right-3 p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-lg transition-all duration-200"
                    >
                      {copySuccess === 'enhanced' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
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
              {copySuccess && copySuccess !== 'enhanced' && (
                <div className="text-center text-emerald-400 text-sm">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
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