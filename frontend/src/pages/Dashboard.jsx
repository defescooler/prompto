import React, { useReducer, useEffect, useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Coins, Trophy, LogOut, Copy, Check, User, CreditCard, HelpCircle, Zap, Repeat2, Settings, Crown, X, Star } from 'lucide-react'
import { AuthContext } from '../App.jsx'

// Import the actual components and use fallbacks if they fail
let Card, CardContent, Button, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
let Progress, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, AnimatedLogo, PromptTerminal

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

try {
  const cardModule = require('@/components/ui/card.jsx')
  Card = cardModule.Card
  CardContent = cardModule.CardContent
} catch {
  Card = ({ children, className = "", onClick }) => (
    <div className={`bg-gradient-to-br border-0 shadow-2xl cursor-pointer group overflow-hidden relative rounded-2xl ${className}`} onClick={onClick}>
      {children}
    </div>
  )
  CardContent = ({ children, className = "" }) => (
    <div className={`p-6 relative z-10 ${className}`}>
      {children}
    </div>
  )
}

try {
  const buttonModule = require('@/components/ui/button.jsx')
  Button = buttonModule.Button
} catch {
  Button = ({ children, className = "", variant = "", onClick, disabled }) => (
    <button 
      className={`px-4 py-2 rounded-2xl transition-all font-medium ${
        variant === 'ghost' ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

try {
  AnimatedLogo = require('@/components/AnimatedLogo.jsx').default
} catch {
  AnimatedLogo = ({ className = "" }) => (
    <motion.div className={`flex items-center ${className}`}>
      <PromptoLogo className="text-emerald-400" />
    </motion.div>
  )
}

try {
  PromptTerminal = require('@/components/PromptTerminal.jsx').default
} catch {
  PromptTerminal = ({ onPromptEnhanced }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <Zap className="w-6 h-6 text-emerald-400" />
        Prompt Terminal
      </h2>
      <textarea 
        className="w-full h-40 bg-slate-950/50 border border-slate-600/50 rounded-xl p-4 text-white resize-none font-mono text-sm backdrop-blur-sm focus:border-emerald-500/50 transition-all"
        placeholder="Enter your prompt here..."
      />
      <button 
        className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-emerald-500/25"
        onClick={onPromptEnhanced}
      >
        <Sparkles className="w-4 h-4 inline mr-2" />
        Enhance Prompt
      </button>
    </motion.div>
  )
}

// Fallback dropdown components
DropdownMenu = ({ children }) => <div className="relative">{children}</div>
DropdownMenuTrigger = ({ children, asChild }) => <div>{children}</div>
DropdownMenuContent = ({ children, className = "" }) => (
  <div className={`absolute right-0 top-full mt-2 min-w-48 bg-slate-900 rounded-2xl border border-slate-700 p-2 shadow-2xl ${className}`}>
    {children}
  </div>
)
DropdownMenuItem = ({ children, className = "", onClick }) => (
  <div className={`p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors ${className}`} onClick={onClick}>
    {children}
  </div>
)

TooltipProvider = ({ children }) => <div>{children}</div>
Tooltip = ({ children }) => <div>{children}</div>
TooltipTrigger = ({ children, asChild }) => <div>{children}</div>
TooltipContent = ({ children, className = "" }) => (
  <div className={`bg-slate-800 border-slate-700 text-white p-3 rounded-xl max-w-xs ${className}`}>
    {children}
  </div>
)

// Advanced prompt engineering techniques catalog
const TECHNIQUES_CATALOG = {
    zero_shot_cot: {
        name: 'Zero-Shot Chain-of-Thought',
        description: 'Add step-by-step reasoning trigger to force the model to externalize reasoning',
        category: 'reasoning',
        default: true,
        icon: '🧠',
        premium: false
    },
    role_prompting: {
        name: 'Role Prompting', 
        description: 'Expert persona assignment to prime style and domain vocabulary',
        category: 'style',
        default: true,
        icon: '👨‍💼',
        premium: false
    },
    xml_schema: {
        name: 'XML/JSON Schema Guardrails',
        description: 'Structured output formatting with explicit tags',
        category: 'structure',
        default: true,
        icon: '📋',
        premium: false
    },
    compression: {
        name: 'Prompt Compression',
        description: 'Minimize tokens while preserving meaning to reduce costs',
        category: 'efficiency',
        default: true,
        icon: '📦',
        premium: false
    },
    few_shot_cot: {
        name: 'Few-Shot CoT',
        description: 'Include reasoning examples to steer both format and depth of the chain',
        category: 'reasoning', 
        default: false,
        icon: '📚',
        premium: true
    },
    self_consistency: {
        name: 'Self-Consistency',
        description: 'Multi-path reasoning verification to boost factual accuracy',
        category: 'accuracy',
        default: false,
        icon: '✅',
        premium: true
    },
    tree_of_thought: {
        name: 'Tree-of-Thought',
        description: 'Branch multiple reasoning paths and score each branch',
        category: 'planning',
        default: false,
        icon: '🌳',
        premium: true
    },
    reflection: {
        name: 'Reflection/ReAct',
        description: 'Interleave Thought-Action-Observation loops for better results',
        category: 'reasoning',
        default: false,
        icon: '🔄',
        premium: true
    },
    program_aided: {
        name: 'Program-Aided Reasoning',
        description: 'Let the model emit code and execute it for enhanced computation',
        category: 'computation',
        default: false,
        icon: '💻',
        premium: true
    },
    chain_verification: {
        name: 'Chain-of-Verification',
        description: 'Run a second pass that critiques and repairs reasoning steps',
        category: 'accuracy',
        default: false,
        icon: '🔍',
        premium: true
    },
    negative_prompts: {
        name: 'Negative/Anti-prompts',
        description: 'Explicit behavior constraints to reduce jailbreak risks',
        category: 'safety',
        default: true,
        icon: '🚫',
        premium: true
    },
    dynamic_memory: {
        name: 'Dynamic Memory',
        description: 'Context-aware information injection using vector similarity',
        category: 'context',
        default: false,
        icon: '🧠',
        premium: true
    },
    rag_augmented: {
        name: 'RAG-Augmented Prompts',
        description: 'Source-cited factual enhancement with retrieved documents',
        category: 'factuality',
        default: false,
        icon: '📖',
        premium: true
    },
    multimodal_cot: {
        name: 'Multimodal CoT',
        description: 'Cross-modal reasoning mixing text, images, and code tokens',
        category: 'multimodal',
        default: false,
        icon: '🖼️',
        premium: true
    },
    custom_instructions: {
        name: 'Parameter-Efficient Instructions',
        description: 'Learned prefix optimization without touching base model weights',
        category: 'efficiency',
        default: false,
        icon: '⚙️',
        premium: true
    },
    triple_prime: {
        name: 'System/Developer/User Roles',
        description: 'Hierarchical role separation to enforce hierarchy',
        category: 'structure',
        default: true,
        icon: '👥',
        premium: true
    },
    temperature_scheduling: {
        name: 'Temperature Scheduling',
        description: 'Dynamic creativity control from ideation to polish',
        category: 'generation',
        default: false,
        icon: '🌡️',
        premium: true
    },
    iterative_decomposition: {
        name: 'Iterative Decomposition',
        description: 'Atomic sub-task breakdown with automatic scratchpad',
        category: 'planning',
        default: false,
        icon: '📋',
        premium: true
    },
    speculative_decoding: {
        name: 'Speculative Decoding',
        description: 'Draft and verify approach to halve latency invisibly',
        category: 'efficiency',
        default: false,
        icon: '⚡',
        premium: true
    },
    voice_anchor: {
        name: 'Voice Anchor Style Transfer',
        description: 'Persona-consistent responses using voice samples',
        category: 'style',
        default: false,
        icon: '🎤',
        premium: true
    },
    ethical_constraints: {
        name: 'Ethical Constraint Plugins',
        description: 'Policy-compliant output filtering via external policy engine',
        category: 'safety',
        default: true,
        icon: '🛡️',
        premium: true
    },
    meta_prompts: {
        name: 'Meta-Prompts',
        description: 'Recursive prompt improvement by enhancing the prompt itself',
        category: 'meta',
        default: false,
        icon: '🔄',
        premium: true
    }
};

// Preset configurations
const PRESETS = {
    lite: ['zero_shot_cot', 'role_prompting', 'xml_schema', 'compression'],
    reasoning: ['zero_shot_cot', 'few_shot_cot', 'self_consistency', 'reflection', 'chain_verification'],
    data_centric: ['rag_augmented', 'dynamic_memory', 'chain_verification', 'xml_schema'],
    creative: ['role_prompting', 'voice_anchor', 'contrastive', 'temperature_scheduling'],
    production: ['xml_schema', 'negative_prompts', 'ethical_constraints', 'compression', 'triple_prime'],
    research: ['tree_of_thought', 'program_aided', 'iterative_decomposition', 'multimodal_cot']
};

const initialState = {
  stats: {
    totalPrompts: 0,
    avgScore: 0,
    tokensSaved: 0,
    masteryLevel: 1
  },
  prompts: [],
  loading: true,
  error: null
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        stats: action.payload.stats,
        prompts: action.payload.prompts 
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext) || { user: null, logout: () => {} }
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const [copiedId, setCopiedId] = useState(null)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [showPremiumBanner, setShowPremiumBanner] = useState(false)
  const [techniques, setTechniques] = useState(() => {
    const defaultTechniques = {}
    Object.keys(TECHNIQUES_CATALOG).forEach(key => {
      defaultTechniques[key] = TECHNIQUES_CATALOG[key].default
    })
    return defaultTechniques
  })
  const [activePresets, setActivePresets] = useState(new Set())
  const [saveStatus, setSaveStatus] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchDashboardData()
    
    // Check URL parameters for advanced settings redirect from extension
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('settings') === 'advanced') {
      setShowAdvancedSettings(true)
      if (!user?.is_premium) {
        setShowPremiumBanner(true)
      }
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [user])

  useEffect(() => {
    if (showAdvancedSettings) {
      fetchUserTechniques()
    }
  }, [showAdvancedSettings])

  useEffect(() => {
    updateActivePresetsBasedOnTechniques()
  }, [techniques])

  const fetchDashboardData = async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      // Simulate API call with mock data for now
      setTimeout(() => {
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            prompts: [
              {
                id: 1,
                title: "Creative Writing Prompt",
                body: "Write a short story about...",
                created_at: new Date().toISOString(),
                effectiveness_score: 8.5
              },
              {
                id: 2,
                title: "Data Analysis Request",
                body: "Analyze the following dataset...",
                created_at: new Date().toISOString(),
                effectiveness_score: 9.2
              }
            ],
            stats: {
              totalPrompts: 15,
              avgScore: 8.7,
              tokensSaved: 2847,
              masteryLevel: 2
            }
          }
        })
      }, 1000)
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
    }
  }

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Advanced Settings Handlers
  const toggleTechnique = (techniqueKey) => {
    if (!user?.is_premium && TECHNIQUES_CATALOG[techniqueKey].premium) {
      setShowPremiumBanner(true)
      return
    }
    
    setTechniques(prev => ({
      ...prev,
      [techniqueKey]: !prev[techniqueKey]
    }))
    updateActivePresetsBasedOnTechniques()
  }

  const togglePreset = (presetName) => {
    if (!user?.is_premium && presetName !== 'lite') {
      setShowPremiumBanner(true)
      return
    }

    const newActivePresets = new Set(activePresets)
    const isCurrentlyActive = newActivePresets.has(presetName)
    
    if (isCurrentlyActive) {
      newActivePresets.delete(presetName)
      const presetTechniques = PRESETS[presetName]
      
      const newTechniques = { ...techniques }
      presetTechniques.forEach(techniqueKey => {
        const stillNeeded = [...newActivePresets].some(otherPreset => 
          PRESETS[otherPreset].includes(techniqueKey)
        )
        
        if (!stillNeeded) {
          newTechniques[techniqueKey] = false
        }
      })
      
      setTechniques(newTechniques)
    } else {
      newActivePresets.add(presetName)
      const presetTechniques = PRESETS[presetName]
      
      const newTechniques = { ...techniques }
      presetTechniques.forEach(techniqueKey => {
        if (TECHNIQUES_CATALOG[techniqueKey]) {
          newTechniques[techniqueKey] = true
        }
      })
      
      setTechniques(newTechniques)
    }
    
    setActivePresets(newActivePresets)
  }

  const updateActivePresetsBasedOnTechniques = () => {
    const newActivePresets = new Set()
    
    Object.entries(PRESETS).forEach(([presetName, presetTechniques]) => {
      const allTechniquesEnabled = presetTechniques.every(technique => techniques[technique])
      if (allTechniquesEnabled) {
        newActivePresets.add(presetName)
      }
    })
    
    setActivePresets(newActivePresets)
  }

  const clearAllPresets = () => {
    setActivePresets(new Set())
    const newTechniques = {}
    Object.keys(techniques).forEach(key => {
      newTechniques[key] = false
    })
    setTechniques(newTechniques)
  }

  const fetchUserTechniques = async () => {
    try {
      const response = await fetch('/api/user/techniques', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTechniques(data.techniques)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user techniques:', error)
    }
  }

  const saveConfiguration = async () => {
    try {
      setSaveStatus({ show: true, message: 'Saving...', type: 'info' })
      
      const response = await fetch('/api/user/techniques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ techniques })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setSaveStatus({ show: true, message: 'Configuration saved successfully!', type: 'success' })
        setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 2000)
      } else {
        throw new Error(data.error || 'Failed to save configuration')
      }
    } catch (error) {
      setSaveStatus({ show: true, message: error.message || 'Failed to save configuration', type: 'error' })
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000)
    }
  }

  // Premium Banner Component
  const PremiumBanner = () => {
    if (!showPremiumBanner) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500 max-w-lg mx-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="font-bold text-lg">Unlock Premium Features</h3>
              <p className="text-sm opacity-90">Access 20+ advanced prompt engineering techniques</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 font-bold px-4 py-2 text-sm"
              onClick={() => {/* TODO: Upgrade modal */}}
            >
              Upgrade
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setShowPremiumBanner(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, onClick, gradient }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card 
        className={`bg-gradient-to-br ${gradient} border-0 shadow-2xl cursor-pointer group overflow-hidden relative`}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
              <p className="text-white text-2xl font-bold mb-1">{value}</p>
              {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden font-mono">
        {/* Header with Logo and User Info */}
        <div className="flex items-center justify-between p-8 pb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <AnimatedLogo className="text-3xl" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent">
                  Welcome back, {user?.username || 'User'}
                </h1>
                {user?.is_premium && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                  >
                    <Crown className="w-4 h-4" />
                    PREMIUM
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-400 text-sm">
                    Level {state.stats.masteryLevel} Prompt Master
                    {user?.is_premium && (
                      <span className="text-yellow-400 ml-2">• Premium Member</span>
                    )}
                  </span>
                </div>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      user?.is_premium 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    }`}
                    style={{ width: `${((state.stats.totalPrompts % 10) / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="h-12 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-2xl transition-all"
            >
              <Settings className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-white font-medium">Advanced Settings</span>
              {!user?.is_premium && <Crown className="w-4 h-4 text-yellow-400 ml-2" />}
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="h-12 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-2xl transition-all cursor-pointer"
                >
                  <User className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-white font-medium">
                    {user?.username || 'User'}
                  </span>
                  {user?.is_premium && <Crown className="w-4 h-4 text-yellow-400 ml-2" />}
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900 border-slate-700 shadow-2xl rounded-2xl p-2 min-w-48">
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer rounded-xl p-3">
              <User className="w-4 h-4 mr-3" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer rounded-xl p-3">
              <CreditCard className="w-4 h-4 mr-3" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logout} 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer rounded-xl p-3"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-8 mb-8"
      >
        {/* Premium Status Banner */}
        {user?.is_premium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Crown className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-yellow-400 text-lg">Premium Active</h3>
                  <p className="text-yellow-300/80 text-sm">
                    Unlock all 20+ advanced techniques • Priority support • No limits
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-sm">ALL FEATURES</div>
                <div className="text-yellow-300/60 text-xs">UNLOCKED</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Sparkles}
          title="Total Prompts"
          value={state.stats.totalPrompts}
          subtitle="enhanced"
          gradient="from-emerald-600 to-emerald-800"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                icon={TrendingUp}
                title="Avg Score"
                value={`${state.stats.avgScore.toFixed(1)}/10`}
                subtitle="effectiveness"
                gradient="from-blue-600 to-blue-800"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700 text-white p-3 rounded-xl max-w-xs">
            <p className="text-sm">
              Score calculated based on prompt clarity, specificity, and enhancement quality. 
              Higher scores indicate more effective prompts.
            </p>
          </TooltipContent>
        </Tooltip>
        <div className="relative">
          <StatCard
            icon={Coins}
            title="Tokens Saved"
            value={`${(state.stats.tokensSaved / 1000).toFixed(1)}K`}
            subtitle="optimization"
            gradient="from-purple-600 to-purple-800"
          />
          {/* Construction Tape Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <div className="absolute top-0 left-0 w-full h-full">
              {/* Diagonal stripes */}
              <div className="absolute -top-2 -left-2 w-[120%] h-8 bg-gradient-to-r from-yellow-400 via-black via-yellow-400 via-black to-yellow-400 transform rotate-12 opacity-90"
                   style={{
                     backgroundImage: 'repeating-linear-gradient(90deg, #facc15 0px, #facc15 20px, #000 20px, #000 40px)',
                   }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-bold text-xs tracking-wider">⚠️ UNDER CONSTRUCTION ⚠️</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-[120%] h-8 bg-gradient-to-r from-yellow-400 via-black via-yellow-400 via-black to-yellow-400 transform -rotate-12 opacity-90"
                   style={{
                     backgroundImage: 'repeating-linear-gradient(90deg, #facc15 0px, #facc15 20px, #000 20px, #000 40px)',
                   }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-bold text-xs tracking-wider">⚠️ COMING SOON ⚠️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatCard
          icon={Trophy}
          title="Mastery Level"
          value={state.stats.masteryLevel}
          subtitle="prompt master"
          gradient="from-orange-600 to-orange-800"
        />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prompt Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PromptTerminal onPromptEnhanced={fetchDashboardData} />
          </motion.div>

          {/* Recent Prompts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-400" />
                  Recent Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {state.prompts.slice(0, 5).map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group bg-slate-800/50 rounded-2xl p-4 hover:bg-slate-800/70 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-white font-medium text-sm truncate flex-1">
                        {prompt.title}
                      </h4>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs rounded-full">
                        {prompt.effectiveness_score}/10
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Original:</p>
                        <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-700 font-mono leading-relaxed">
                          {prompt.original_prompt?.substring(0, 120)}...
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Enhanced:</p>
                        <div className="relative">
                          <p className="text-sm text-emerald-400 bg-slate-900/50 p-3 rounded-xl border border-slate-700 font-mono pr-16 leading-relaxed">
                            {prompt.enhanced_prompt?.substring(0, 120)}...
                          </p>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400 transition-all"
                                  onClick={() => {
                                    // Re-use this prompt in terminal
                                    const event = new CustomEvent('reusePrompt', { 
                                      detail: prompt.original_prompt 
                                    })
                                    window.dispatchEvent(event)
                                  }}
                                >
                                  <Repeat2 className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Re-use this prompt</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-400 transition-all"
                                  onClick={() => copyToClipboard(prompt.enhanced_prompt, prompt.id)}
                                >
                                  {copiedId === prompt.id ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy enhanced prompt</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {state.prompts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Sparkles className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      ✨ Ready to enhance your first prompt?
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Try something like: "summarize this tweet" or "write a professional email"
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Story', 'Email', 'Summary', 'Code'].map((type) => (
                        <Badge key={type} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer transition-all">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Advanced Settings Section */}
      {showAdvancedSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-8 pb-8"
        >
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grid)' /%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                  <Settings className="w-8 h-8" />
                  Advanced Prompt Engineering
                </h2>
                <p className="text-lg opacity-90">
                  Configure cutting-edge techniques for optimal AI interactions
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Live Configuration</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Crown className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium">Premium Features</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Stats */}
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 rounded-2xl mb-8 flex justify-around text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-400 font-mono">
                    {Object.values(techniques).filter(Boolean).length}
                  </div>
                  <div className="text-sm opacity-90 font-mono uppercase tracking-wide">Techniques Enabled</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400 font-mono">
                    {Object.keys(TECHNIQUES_CATALOG).length}
                  </div>
                  <div className="text-sm opacity-90 font-mono uppercase tracking-wide">Total Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400 font-mono">
                    {(() => {
                      let score = 60;
                      if (techniques.zero_shot_cot) score += 8;
                      if (techniques.role_prompting) score += 6;
                      if (techniques.xml_schema) score += 5;
                      if (techniques.chain_verification) score += 7;
                      if (techniques.self_consistency) score += 6;
                      if (techniques.negative_prompts) score += 4;
                      if (techniques.ethical_constraints) score += 3;
                      
                      const reasoningTechniques = ['zero_shot_cot', 'few_shot_cot', 'self_consistency', 'reflection', 'tree_of_thought'];
                      const enabledReasoning = reasoningTechniques.filter(key => techniques[key]).length;
                      if (enabledReasoning >= 2) score += 5;
                      if (enabledReasoning >= 3) score += 3;
                      
                      const activePresetCount = activePresets.size;
                      if (activePresetCount >= 2) score += 4;
                      if (activePresetCount >= 3) score += 3;
                      
                      return Math.min(99, score);
                    })()}
                  </div>
                  <div className="text-sm opacity-90 font-mono uppercase tracking-wide">Effectiveness Score</div>
                </div>
              </div>

              {/* Presets */}
              <div className="mb-8">
                <h3 className="prompto-section-title">Configuration Presets</h3>
                <p className="text-slate-400 text-sm mb-6 font-mono">
                  Click multiple presets to combine technique sets. Active presets will be highlighted.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                  {Object.entries(PRESETS).map(([key, techniques]) => (
                    <button
                      key={key}
                      onClick={() => togglePreset(key)}
                      disabled={!user?.is_premium && key !== 'lite'}
                      className={`
                        preset-chip
                        ${activePresets.has(key) ? 'active' : ''}
                        ${!user?.is_premium && key !== 'lite' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                      `}
                    >
                      {key.replace('_', '-')}
                      {!user?.is_premium && key !== 'lite' && (
                        <Crown className="w-3 h-3 ml-1 text-yellow-400 inline" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={clearAllPresets}
                    className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-xl transition-all font-mono text-sm uppercase tracking-wide"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Techniques Grid */}
              <div className="mb-8">
                <h3 className="prompto-section-title">Individual Techniques</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(TECHNIQUES_CATALOG).map(([key, technique]) => {
                    const isEnabled = techniques[key]
                    const isPremium = technique.premium
                    const canToggle = user?.is_premium || !isPremium
                    
                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: canToggle ? 1.02 : 1, y: canToggle ? -2 : 0 }}
                        className={`
                          technique-card
                          ${!canToggle ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-white text-lg font-mono">
                                {technique.name}
                              </h4>
                              {isPremium && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed font-mono mb-3">
                              {technique.description}
                            </p>
                            <div className="mt-3">
                              <span className="bg-slate-700/50 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg text-xs uppercase font-medium font-mono tracking-wider">
                                {technique.category}
                              </span>
                            </div>
                          </div>
                          
                          {/* Toggle Switch */}
                          <div className="ml-4 flex-shrink-0">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => toggleTechnique(key)}
                                disabled={!canToggle}
                                className="toggle-input"
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Save Section */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                <Button
                  onClick={saveConfiguration}
                  className="prompto-button"
                >
                  Save Configuration
                </Button>
                {saveStatus.show && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl font-medium font-mono ${
                      saveStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      saveStatus.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {saveStatus.message}
                  </motion.div>
                )}
                <p className="mt-4 text-slate-400 text-sm font-mono uppercase tracking-wide">
                  Settings are synchronized across all devices
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Banner */}
      <PremiumBanner />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(30, 41, 59);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(51, 65, 85);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(34, 197, 94);
        }
        
        .prompto-section-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 2px solid #0DA30D;
          padding-bottom: 8px;
        }
        
        .preset-chip {
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #ccc;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.85rem;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
        }
        
        .preset-chip:hover {
          background: #3a3a3a;
          border-color: #0DA30D;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 163, 13, 0.2);
        }
        
        .preset-chip.active {
          background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
          border-color: #0DA30D;
          color: white;
          box-shadow: 0 4px 12px rgba(13, 163, 13, 0.3);
        }
        
        .technique-card {
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.2s ease;
        }
        
        .technique-card:hover {
          border-color: #0DA30D;
          box-shadow: 0 8px 24px rgba(13, 163, 13, 0.1);
          transform: translateY(-2px);
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        
        .toggle-input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #444;
          transition: 0.4s;
          border-radius: 34px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        
        .toggle-input:checked + .toggle-slider {
          background-color: #0DA30D;
        }
        
        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }
        
        .toggle-input:disabled + .toggle-slider {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .prompto-button {
          background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
          border: none;
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          box-shadow: 0 4px 12px rgba(13, 163, 13, 0.3);
        }
        
        .prompto-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(13, 163, 13, 0.4);
        }
        
        .prompto-button:active {
          transform: translateY(0);
        }
       `}</style>
       </div>
     </TooltipProvider>
   )
}
