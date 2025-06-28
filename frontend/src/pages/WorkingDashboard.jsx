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
  RotateCcw,
  Crown,
  Rocket,
  Star,
  ArrowRight,
  Shield,
  Gauge,
  X,
  Save,
  FileText,
  Target
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Footer from '@/components/ui/footer'
// import './dashboard-optimizations.css' // Temporarily commented out for troubleshooting

// Add styles for category badges
const categoryStyles = `
  .category-reasoning {
    background-color: rgba(59, 130, 246, 0.2);
    color: rgb(147, 197, 253);
  }
  .category-accuracy {
    background-color: rgba(34, 197, 94, 0.2);
    color: rgb(134, 239, 172);
  }
  .category-style {
    background-color: rgba(168, 85, 247, 0.2);
    color: rgb(196, 181, 253);
  }
  .category-planning {
    background-color: rgba(245, 158, 11, 0.2);
    color: rgb(252, 211, 77);
  }
  .category-structure {
    background-color: rgba(236, 72, 153, 0.2);
    color: rgb(251, 207, 232);
  }
`

// Animation configurations
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

// Pro Settings Modal Component
const ProSettingsModal = memo(({ isOpen, onClose }) => {
  const [techniques, setTechniques] = useState({})
  const [activePresets, setActivePresets] = useState(new Set())
  const [saveStatus, setSaveStatus] = useState('')

  const techniquesData = useMemo(() => [
    { id: 'chain_of_thought', name: 'Chain of Thought', description: 'Break down complex problems step by step', category: 'reasoning', enabled: true },
    { id: 'few_shot', name: 'Few-Shot Learning', description: 'Provide examples to guide responses', category: 'accuracy', enabled: true },
    { id: 'role_prompting', name: 'Role Prompting', description: 'Assign specific roles for better context', category: 'style', enabled: false },
    { id: 'tree_of_thoughts', name: 'Tree of Thoughts', description: 'Explore multiple reasoning paths', category: 'reasoning', enabled: false },
    { id: 'self_consistency', name: 'Self-Consistency', description: 'Generate multiple answers and select best', category: 'accuracy', enabled: true },
    { id: 'step_back', name: 'Step-Back Prompting', description: 'Ask higher-level questions first', category: 'planning', enabled: false },
    { id: 'persona_pattern', name: 'Persona Pattern', description: 'Define specific character traits', category: 'style', enabled: false },
    { id: 'template_pattern', name: 'Template Pattern', description: 'Use structured response formats', category: 'structure', enabled: true }
  ], [])

  const presets = useMemo(() => ({
    lite: ['chain_of_thought', 'few_shot', 'self_consistency'],
    reasoning: ['chain_of_thought', 'tree_of_thoughts', 'step_back', 'self_consistency'],
    creative: ['role_prompting', 'persona_pattern', 'template_pattern'],
    production: ['chain_of_thought', 'few_shot', 'self_consistency', 'template_pattern'],
    research: ['step_back', 'self_consistency', 'chain_of_thought'],
    data_centric: ['template_pattern', 'self_consistency', 'few_shot']
  }), [])

  useEffect(() => {
    if (isOpen) {
      const initialTechniques = {}
      techniquesData.forEach(tech => {
        initialTechniques[tech.id] = tech.enabled
      })
      setTechniques(initialTechniques)
    }
  }, [isOpen, techniquesData])

  const handlePresetToggle = useCallback((presetId) => {
    setActivePresets(prev => {
      const newPresets = new Set(prev)
      if (newPresets.has(presetId)) {
        newPresets.delete(presetId)
        // Disable techniques from this preset
        const newTechniques = { ...techniques }
        presets[presetId].forEach(techId => {
          newTechniques[techId] = false
        })
        setTechniques(newTechniques)
      } else {
        newPresets.add(presetId)
        // Enable techniques from this preset
        const newTechniques = { ...techniques }
        presets[presetId].forEach(techId => {
          newTechniques[techId] = true
        })
        setTechniques(newTechniques)
      }
      return newPresets
    })
  }, [techniques, presets])

  const handleTechniqueToggle = useCallback((techId) => {
    setTechniques(prev => ({
      ...prev,
      [techId]: !prev[techId]
    }))
  }, [])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }, [])

  const enabledCount = Object.values(techniques).filter(Boolean).length
  const totalCount = techniquesData.length

  if (!isOpen) return null

  return (
    <AnimatePresence key="pro-settings-modal">
      <style>{categoryStyles}</style>
      <motion.div
        key="pro-settings-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="pro-settings-dialog"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-950 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/30 rounded-lg">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Pro Settings</h2>
                <p className="text-slate-300 text-sm">Advanced AI technique configuration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Stats */}
            <div className="p-6 border-b border-white/20">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-300">{enabledCount}</div>
                  <div className="text-sm text-slate-300">Enabled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalCount}</div>
                  <div className="text-sm text-slate-300">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300">92</div>
                  <div className="text-sm text-slate-300">Quality</div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Configuration Presets</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(presets).map(presetId => (
                  <button
                    key={presetId}
                    onClick={() => handlePresetToggle(presetId)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      activePresets.has(presetId)
                        ? 'bg-emerald-600/40 border-emerald-500/60 text-white'
                        : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                    }`}
                    style={{
                      backgroundColor: activePresets.has(presetId) ? 'rgba(5, 150, 105, 0.4)' : 'rgb(15, 23, 42)',
                      borderColor: activePresets.has(presetId) ? 'rgba(16, 185, 129, 0.6)' : 'rgb(51, 65, 85)',
                      color: 'white'
                    }}
                  >
                    <div className="font-medium capitalize">{presetId.replace('_', ' ')}</div>
                    <div className="text-xs text-white/70 mt-1">
                      {presets[presetId].length} techniques
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Techniques */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Individual Techniques</h3>
              <div className="space-y-3">
                {techniquesData.map(technique => (
                  <div
                    key={technique.id}
                    className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                    style={{
                      backgroundColor: 'rgb(15, 23, 42)',
                      borderColor: 'rgb(51, 65, 85)',
                      color: 'white'
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-white">{technique.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium category-${technique.category}`}>
                          {technique.category}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mt-1">{technique.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={techniques[technique.id] || false}
                        onChange={() => handleTechniqueToggle(technique.id)}
                        className="sr-only"
                      />
                                              <div className={`w-11 h-6 rounded-full transition-colors ${
                        techniques[technique.id] ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          techniques[technique.id] ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/20 bg-slate-900/70">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">
                Settings sync across all devices
              </div>
              <div className="flex items-center gap-3">
                {saveStatus && (
                  <div className={`text-sm px-3 py-1 rounded-lg ${
                    saveStatus === 'success' ? 'bg-emerald-500/30 text-emerald-300' :
                    saveStatus === 'error' ? 'bg-red-500/30 text-red-300' :
                    'bg-white/20 text-white/70'
                  }`}>
                    {saveStatus === 'success' ? '✓ Saved' :
                     saveStatus === 'error' ? '✗ Error' :
                     'Saving...'}
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: 'rgb(5, 150, 105)',
                    color: 'white'
                  }}
                >
                  <Save className="w-4 h-4" />
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
})

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

// Modern Stat Card Component
const StatCard = memo(({ icon: Icon, title, value, subtitle, gradient, onClick, isPremium = false }) => {
  const IconComponent = Icon || Sparkles
  const safeTitle = (typeof title === 'string' && title.length > 0) ? title : 'Unknown'
  const safeValue = (value !== null && value !== undefined) ? value : 0
  const safeSubtitle = (typeof subtitle === 'string') ? subtitle : ''

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={ANIMATION_CONFIG}
      className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl min-h-[120px] flex flex-col items-center justify-center gap-2 cursor-pointer group overflow-hidden ${isPremium ? 'border-amber-500/30' : ''}`}
      onClick={onClick}
    >
      {isPremium && (
        <div className="absolute top-3 right-3">
          <Crown className="w-3 h-3 text-amber-400" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 text-center px-4">
        <div className="inline-flex mb-3">
          <IconComponent className="h-9 w-9 text-emerald-400/60" strokeWidth={1.5} />
        </div>
        <p className="text-2xl lg:text-3xl font-semibold text-white mb-2">{safeValue}</p>
        <p className="text-xs text-white/60 font-medium mb-1">{safeTitle}</p>
        {safeSubtitle && <p className="text-xs text-slate-400 tracking-wide pb-2">{safeSubtitle}</p>}
      </div>
    </motion.div>
  )
})

// Premium Upgrade Banner
const PremiumBanner = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mx-8 mb-8"
  >
    <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Unlock Premium Power</h3>
            <p className="text-white/60 text-sm">Advanced techniques, unlimited prompts, priority support</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-white font-bold text-xl">$5.99<span className="text-sm font-normal text-white/60">/mo</span></div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
))

// Prompt Card Component
const PromptCard = memo(({ prompt, onCopy }) => {
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
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white truncate flex-1 mr-2">{safePrompt.title}</h3>
        <span className="text-emerald-400 text-sm bg-emerald-500/20 px-2 py-1 rounded-lg whitespace-nowrap">
          {Number(safePrompt.effectiveness_score).toFixed(1)}/10
        </span>
      </div>
      <p className="text-white/60 text-sm mb-3 line-clamp-2">{safePrompt.body}</p>
      <button 
        onClick={handleCopy}
        className="text-white/40 hover:text-emerald-400 text-xs transition-colors flex items-center gap-1"
      >
        <Copy className="w-3 h-3" />
        Copy
      </button>
    </div>
  )
})

const PromptoLogo = ({ className = "" }) => (
  <svg width="180" height="40" viewBox="0 0 1146 248" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} flex-shrink-0`} preserveAspectRatio="xMidYMid meet">
    <path d="M177.371 190.096V46.041H212.094V80.7836H212.941V190.096H177.371ZM212.941 114.961L209.271 80.7836C212.658 68.5436 218.398 59.2225 226.491 52.82C234.583 46.4176 244.276 43.2164 255.567 43.2164C259.52 43.2164 262.343 43.593 264.036 44.3462V77.959C263.095 77.5824 261.778 77.3941 260.084 77.3941C258.39 77.2058 256.32 77.1116 253.874 77.1116C240.135 77.1116 229.878 80.1245 223.103 86.1503C216.328 92.1762 212.941 101.78 212.941 114.961Z" fill="white"/>
    <path d="M351.482 192.92C336.238 192.92 322.782 189.719 311.114 183.317C299.634 176.914 290.694 168.064 284.296 156.765C277.897 145.279 274.698 132.191 274.698 117.503C274.698 102.815 277.897 89.9165 284.296 78.8064C290.694 67.6963 299.634 59.0342 311.114 52.82C322.782 46.4176 336.238 43.2164 351.482 43.2164C366.915 43.2164 380.371 46.4176 391.851 52.82C403.331 59.0342 412.27 67.6963 418.669 78.8064C425.068 89.9165 428.267 102.815 428.267 117.503C428.267 132.191 424.974 145.279 418.387 156.765C411.988 168.064 403.049 176.914 391.569 183.317C380.089 189.719 366.726 192.92 351.482 192.92ZM351.482 164.392C359.01 164.392 365.785 162.509 371.808 158.743C377.83 154.788 382.535 149.327 385.923 142.36C389.31 135.204 391.004 126.825 391.004 117.221C391.004 103.098 387.24 91.9878 379.712 83.8907C372.372 75.7935 362.962 71.7449 351.482 71.7449C340.002 71.7449 330.498 75.7935 322.97 83.8907C315.442 91.9878 311.678 103.098 311.678 117.221C311.678 126.825 313.372 135.204 316.76 142.36C320.336 149.327 325.041 154.788 330.875 158.743C336.897 162.509 343.766 164.392 351.482 164.392Z" fill="white"/>
    <path d="M454.431 190.096V46.041H489.153V79.9362H490V190.096H454.431ZM551.259 190.096V97.1663C551.259 88.6925 549.094 82.4784 544.766 78.5239C540.625 74.3812 534.697 72.3098 526.981 72.3098C520.206 72.3098 513.995 73.9104 508.349 77.1116C502.703 80.3128 498.187 84.8322 494.799 90.6697C491.6 96.5072 490 103.286 490 111.007L486.33 77.959C491.223 67.4138 498.281 59.0342 507.502 52.82C516.724 46.4176 527.451 43.2164 539.684 43.2164C554.364 43.2164 565.938 47.4533 574.407 55.9271C582.876 64.2126 587.11 74.9461 587.11 88.1276V190.096H551.259ZM648.087 190.096V97.1663C648.087 88.6925 646.016 82.4784 641.876 78.5239C637.736 74.3812 631.807 72.3098 624.091 72.3098C617.128 72.3098 610.823 73.9104 605.177 77.1116C599.531 80.3128 595.109 84.8322 591.909 90.6697C588.71 96.5072 587.11 103.286 587.11 111.007L580.9 77.959C585.605 67.4138 592.756 59.0342 602.354 52.82C611.952 46.4176 623.056 43.2164 635.665 43.2164C650.721 43.2164 662.484 47.5475 670.953 56.2096C679.61 64.6834 683.938 75.9818 683.938 90.1048V190.096H648.087Z" fill="white"/>
    <path d="M802.336 192.92C788.597 192.92 777.399 189.719 768.742 183.317C760.273 176.726 755.004 167.687 752.934 156.2L755.756 155.918V248H720.187V46.041H754.91V78.5239L752.087 77.959C754.721 67.2255 760.744 58.7517 770.154 52.5376C779.564 46.3235 791.044 43.2164 804.594 43.2164C817.391 43.2164 828.495 46.3235 837.905 52.5376C847.503 58.5634 854.937 67.1314 860.206 78.2415C865.476 89.3516 868.111 102.439 868.111 117.503C868.111 132.756 865.382 146.032 859.924 157.33C854.466 168.629 846.844 177.385 837.058 183.599C827.272 189.813 815.698 192.92 802.336 192.92ZM793.302 163.544C804.782 163.544 813.91 159.59 820.685 151.681C827.46 143.584 830.848 132.285 830.848 117.786C830.848 103.286 827.366 92.082 820.403 84.1731C813.627 76.2642 804.5 72.3098 793.02 72.3098C781.728 72.3098 772.6 76.3584 765.637 84.4556C758.674 92.3645 755.192 103.569 755.192 118.068C755.192 132.568 758.674 143.772 765.637 151.681C772.6 159.59 781.822 163.544 793.302 163.544Z" fill="white"/>
    <path d="M957.134 192.92C939.443 192.92 926.363 188.778 917.894 180.492C909.614 172.018 905.473 159.402 905.473 142.642V13.2756L941.325 0V143.49C941.325 150.457 943.207 155.636 946.971 159.025C950.735 162.415 956.663 164.109 964.756 164.109C967.955 164.109 970.778 163.921 973.225 163.544C975.86 162.979 978.306 162.32 980.564 161.567V189.248C978.306 190.378 975.107 191.226 970.966 191.79C966.826 192.544 962.215 192.92 957.134 192.92ZM877.808 74.0046V46.041H980.564V74.0046H877.808Z" fill="white"/>
    <path d="M1068.25 192.92C1053.01 192.92 1039.55 189.719 1027.88 183.317C1016.4 176.914 1007.47 168.064 1001.07 156.765C994.668 145.279 991.468 132.191 991.468 117.503C991.468 102.815 994.668 89.9165 1001.07 78.8064C1007.47 67.6963 1016.4 59.0342 1027.88 52.82C1039.55 46.4176 1053.01 43.2164 1068.25 43.2164C1083.69 43.2164 1097.14 46.4176 1108.62 52.82C1120.1 59.0342 1129.04 67.6963 1135.44 78.8064C1141.84 89.9165 1145.04 102.815 1145.04 117.503C1145.04 132.191 1141.74 145.279 1135.16 156.765C1128.76 168.064 1119.82 176.914 1108.34 183.317C1096.86 189.719 1083.5 192.92 1068.25 192.92ZM1068.25 164.392C1075.78 164.392 1082.56 162.509 1088.58 158.743C1094.6 154.788 1099.31 149.327 1102.69 142.36C1106.08 135.204 1107.77 126.825 1107.77 117.221C1107.77 103.098 1104.01 91.9878 1096.48 83.8907C1089.14 75.7935 1079.73 71.7449 1068.25 71.7449C1056.77 71.7449 1047.27 75.7935 1039.74 83.8907C1032.21 91.9878 1028.45 103.098 1028.45 117.221C1028.45 126.825 1030.14 135.204 1033.53 142.36C1037.11 149.327 1041.81 154.788 1047.65 158.743C1053.67 162.509 1060.54 164.392 1068.25 164.392Z" fill="white"/>
    <mask id="mask0_579_80" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="40" width="151" height="208">
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
  const { user, logout, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isProSettingsOpen, setIsProSettingsOpen] = useState(false)
  
  // Mock data with startup metrics
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
      body: "Write a compelling story about an AI startup that revolutionizes...",
      effectiveness_score: 8.5
    },
    {
      id: 2,
      title: "Data Analysis Request", 
      body: "Analyze user engagement metrics and identify growth opportunities...",
      effectiveness_score: 9.2
    }
  ], [])

  // Safe user display
  const safeUser = useMemo(() => ({
    username: user?.username || 'User',
    email: user?.email || '',
    isPremium: user?.is_premium || false
  }), [user])

  // Initialize component
  useEffect(() => {
    setLoading(false)
  }, [])

  // Copy function
  const copyToClipboard = useCallback(async (text, promptId) => {
    try {
      if (!navigator.clipboard) {
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

  // Logout handler
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

  // Error display component
  const ErrorDisplay = memo(() => {
    if (!error) return null
    return (
      <AnimatePresence key="error-display">
        <motion.div 
          key="error-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-8 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200"
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
      </AnimatePresence>
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      
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

  // Handle pro settings
  const handleAdvancedSettings = useCallback(() => {
    // Always open for testing - remove premium check temporarily
    setIsProSettingsOpen(true)
  }, [])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <ErrorDisplay />
      
      {/* Header */}
      <div className="relative px-8 py-8">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="transition-all duration-200"
          >
            <PromptoLogo className="text-emerald-400" />
          </motion.button>
          
          <div className="flex items-center gap-3 overflow-visible">
            {/* Pro Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdvancedSettings}
              className="hidden sm:flex px-4 py-2 rounded-xl font-medium transition-all duration-200 items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
            >
              <Settings className="w-4 h-4" />
              Pro Settings
              <Crown className="w-3 h-3" />
            </motion.button>

            {/* User Menu */}
            <div className="relative flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 max-w-[200px]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium truncate">{safeUser.username}</span>
                  {safeUser.isPremium && <Crown className="w-4 h-4 text-amber-400" />}
                </div>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl z-[100]"
                  >
                    <div className="p-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium rounded-lg transition-all duration-200 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="px-8 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent mb-2">
            Welcome back, {safeUser.username}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <Trophy className="w-4 h-4 text-emerald-400" />
            Level {stats.masteryLevel} Prompt Master
            <div className="w-24 h-1 bg-white/10 rounded-full ml-2">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        {!safeUser.isPremium && <PremiumBanner />}

        {/* Stats Ribbon */}
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <StatCard
                icon={FileText}
                title="Total Prompts"
                value={47}
                subtitle="+12 this week"
                gradient="bg-emerald-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <StatCard
                icon={Target}
                title="Average Score"
                value="8.7/10"
                subtitle="Excellent"
                gradient="bg-blue-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <StatCard
                icon={Zap}
                title="Efficiency Gain"
                value="12.8K"
                subtitle="Tokens saved"
                gradient="bg-purple-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <StatCard
                icon={Crown}
                title="Level 2"
                value="Prompt Master"
                subtitle="240 XP to Level 3"
                gradient="bg-amber-500"
                isPremium={safeUser.isPremium}
              />
            </div>
          </div>
        </div>

        {/* Prompt Terminal Section */}
        <div className="max-w-screen-xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl min-h-[180px] p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Prompt Terminal
          </h2>
          
          <div className="space-y-4">
            <textarea 
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white resize-none text-sm backdrop-blur-sm focus:border-emerald-500/50 transition-all focus:outline-none placeholder-white/40"
              placeholder="Enter your prompt here..."
              disabled={isEnhancing}
            />
            
            <div className="flex gap-3">
              <button 
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !promptText.trim()}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-2 ${
                  isEnhancing || !promptText.trim() 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-emerald-500/25'
                }`}
              >
                {isEnhancing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Enhance
                  </>
                )}
              </button>
              
              <button 
                onClick={clearPrompt}
                disabled={isEnhancing}
                className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                  isEnhancing 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                Clear
              </button>
            </div>
            
            <AnimatePresence key="enhanced-prompt">
              {enhancedPrompt && (
                <motion.div
                  key="enhanced-prompt-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                <h3 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Enhanced Prompt
                </h3>
                <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-4 relative">
                  <pre className="text-emerald-300 text-sm whitespace-pre-wrap leading-relaxed">
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
            </AnimatePresence>
          </div>
        </div>

        {/* Recent Prompts Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Recent Prompts
          </h2>
          <div className="space-y-3">
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

      {/* Footer */}
      <Footer />

      {/* Pro Settings Modal */}
      <ProSettingsModal 
        isOpen={isProSettingsOpen}
        onClose={() => setIsProSettingsOpen(false)}
      />
      
      {/* Debug indicator */}
      {isProSettingsOpen && (
        <div className="fixed top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs z-[60]">
          Modal Open
        </div>
      )}
    </div>
  )
}

// Wrapped with Error Boundary
const OptimizedDashboard = memo(() => (
  <DashboardErrorBoundary>
    <WorkingDashboard />
  </DashboardErrorBoundary>
))

OptimizedDashboard.displayName = 'OptimizedDashboard'

export default OptimizedDashboard 