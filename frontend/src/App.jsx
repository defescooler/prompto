import { useState, useEffect, createContext, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Sparkles, Heart, BarChart3, Settings, User, LogOut, CheckCircle, Zap, Clock, TrendingUp, Star } from 'lucide-react'
import './App.css'

// API Configuration
const API_BASE_URL = 'http://localhost:8002'

// Add this function after imports, before AuthContext
function useKeyboardShortcuts(textareaRef, setText, text) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement !== textareaRef.current) return
      
      // Ctrl+A - Select all text
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        textareaRef.current.select()
      }
      
      // Ctrl+D - Duplicate line
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        // ... duplication logic
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [textareaRef, setText, text])
}


// Authentication Context
const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetch(`${API_BASE_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
          setToken(null)
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    
    if (data.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    
    if (data.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Header Component
function Header({ user, logout }) {
  return (
    <header className="border-b bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-200 shadow-lg sticky top-0 z-50 animate__animated animate__fadeInDown">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            {/* Pixel Star */}
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="float-animation">
              <rect x="20" y="4" width="8" height="8" fill="#FFD600"/>
              <rect x="16" y="8" width="16" height="8" fill="#FFD600"/>
              <rect x="12" y="16" width="24" height="8" fill="#FFD600"/>
              <rect x="8" y="24" width="32" height="8" fill="#FFD600"/>
              <rect x="12" y="32" width="24" height="8" fill="#FFD600"/>
              <rect x="16" y="40" width="16" height="4" fill="#FFD600"/>
            </svg>
            <div>
              <h1 className="text-2xl font-extrabold gradient-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent animate__animated animate__pulse animate__infinite">
                Prompt Copilot
              </h1>
              <p className="text-sm font-semibold gradient-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent animate__animated animate__fadeIn animate__delay-1s">
                AI-Powered Prompt Enhancement
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Fancy yellow badge for flair */}
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-200 text-yellow-900 font-bold shadow-lg animate__animated animate__pulse animate__infinite flex items-center gap-2">
            <svg width='20' height='20' viewBox='0 0 48 48' fill='none' className='inline-block mr-1'><rect x='20' y='4' width='8' height='8' fill='#FFD600'/><rect x='16' y='8' width='16' height='8' fill='#FFD600'/><rect x='12' y='16' width='24' height='8' fill='#FFD600'/><rect x='8' y='24' width='32' height='8' fill='#FFD600'/><rect x='12' y='32' width='24' height='8' fill='#FFD600'/><rect x='16' y='40' width='16' height='4' fill='#FFD600'/></svg>
          </span>
          {user && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{user.username}</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Login/Register Component
function AuthForm({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isLogin 
        ? await onLogin({ username_or_email: formData.username, password: formData.password })
        : await onRegister(formData)
      
      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 font-sans">
      <Card className="w-full max-w-md glass shadow-2xl rounded-3xl border-0">
        <CardHeader className="flex flex-col items-center pb-2">
          <PixelStar />
          <CardTitle className="text-2xl font-extrabold gradient-text mb-1 tracking-tight">
            {isLogin ? 'Sign In to Prompt Copilot' : 'Join Prompt Copilot'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" autoComplete="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="rounded-lg" />
              </div>
            )}
            <div>
              <Label htmlFor="username">Username or Email</Label>
              <Input id="username" type="text" autoComplete="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required className="rounded-lg" />
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="rounded-lg" />
              </div>
            )}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required className="rounded-lg" />
            </div>
            {error && <div className="text-red-500 text-center text-sm font-medium animate-pulse">{error || 'An error occurred. Please try again.'}</div>}
            <Button type="submit" className="w-full rounded-lg bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-md transition">{loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}</Button>
          </form>
          <div className="text-center text-sm text-gray-500 mt-2">
            {isLogin ? (
              <>Don&apos;t have an account? <span className="text-yellow-600 hover:underline cursor-pointer font-semibold" onClick={() => setIsLogin(false)}>Sign up</span></>
            ) : (
              <>Already have an account? <span className="text-yellow-600 hover:underline cursor-pointer font-semibold" onClick={() => setIsLogin(true)}>Sign in</span></>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dashboard Component
function Dashboard({ user, token }) {
  const [prompts, setPrompts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchPrompts()
    fetchAnalytics()
  }, [])

  const fetchPrompts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setPrompts(data.prompts || [])
    } catch (error) {
      console.error('Error fetching prompts:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  // Animated stat card
  const StatCard = ({ label, value, icon, color }) => (
    <div className="glass flex flex-col items-center justify-center p-3 rounded-lg shadow-md animate__animated animate__fadeInUp" style={{ minHeight: 72, maxWidth: 140 }}>
      <div className="mb-1">{icon}</div>
      <div className="text-2xl font-extrabold mb-0.5" style={{ color, letterSpacing: '0.01em' }}>{value}</div>
      <div className="text-xs font-bold text-yellow-800 tracking-wide uppercase drop-shadow-sm" style={{ letterSpacing: '0.04em' }}>{label}</div>
    </div>
  )

  // Pixel star animation
  const PixelStar = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 float-animation">
      <rect x="20" y="4" width="8" height="8" fill="#FFD600"/>
      <rect x="16" y="8" width="16" height="8" fill="#FFD600"/>
      <rect x="12" y="16" width="24" height="8" fill="#FFD600"/>
      <rect x="8" y="24" width="32" height="8" fill="#FFD600"/>
      <rect x="12" y="32" width="24" height="8" fill="#FFD600"/>
      <rect x="16" y="40" width="16" height="4" fill="#FFD600"/>
    </svg>
  )

  // Animated number (simple)
  const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0)
    useEffect(() => {
      let start = 0
      const end = Number(value)
      if (start === end) return
      let increment = end / 30
      let current = start
      const timer = setInterval(() => {
        current += increment
        if (current >= end) {
          setDisplay(end)
          clearInterval(timer)
        } else {
          setDisplay(Math.round(current))
        }
      }, 16)
      return () => clearInterval(timer)
    }, [value])
    return <span>{display}</span>
  }

  // ROI, cost, effectiveness, streaks (mocked for now)
  const effectiveness = analytics?.analytics?.success_rate ? Math.round(analytics.analytics.success_rate * 100) / 100 : 0
  const cost = (analytics?.analytics?.prompts_enhanced || 0) * 0.002 // e.g., $0.002 per prompt
  const roi = effectiveness > 0 ? ((effectiveness * 100) / (cost || 1)).toFixed(1) : 0
  const streak = Math.min(analytics?.analytics?.prompts_enhanced || 0, 7)

  return (
    <div className="min-h-screen gradient-bg py-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <PixelStar />
          <h1 className="text-4xl font-extrabold gradient-text text-center mb-2 animate__animated animate__fadeInDown">Prompt Copilot Dashboard</h1>
          <p className="text-lg text-yellow-800 font-semibold text-center animate__animated animate__fadeIn">Your AI prompt analytics, history, and stats</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Enhanced" value={<AnimatedNumber value={analytics?.analytics?.prompts_enhanced || 0} />} icon={<span role="img" aria-label="spark">✨</span>} color="#FFD600" />
          <StatCard label="Time Saved" value={analytics?.time_saved_formatted || '0m 0s'} icon={<span role="img" aria-label="clock">⏰</span>} color="#FFD600" />
          <StatCard label="Favorites" value={<AnimatedNumber value={analytics?.favorite_prompts || 0} />} icon={<span role="img" aria-label="star">⭐</span>} color="#FFD600" />
          <StatCard label="Streak" value={<AnimatedNumber value={streak} />} icon={<span role="img" aria-label="fire">🔥</span>} color="#FFD600" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Effectiveness" value={effectiveness + '%'} icon={<span role="img" aria-label="target">🎯</span>} color="#FFD600" />
          <StatCard label="Cost" value={`$${cost.toFixed(2)}`} icon={<span role="img" aria-label="money">💸</span>} color="#FFD600" />
          <StatCard label="ROI" value={`${roi}x`} icon={<span role="img" aria-label="rocket">🚀</span>} color="#FFD600" />
          <StatCard label="Total Usage" value={<AnimatedNumber value={analytics?.analytics?.total_usage || 0} />} icon={<span role="img" aria-label="chart">📈</span>} color="#FFD600" />
        </div>
        <div className="glass p-6 rounded-2xl shadow-xl animate__animated animate__fadeInUp">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center"><span className="mr-2">📝</span>Prompt History</h2>
          <div className="max-h-80 overflow-y-auto space-y-4">
            {prompts.length === 0 && <div className="text-yellow-600 text-center">No prompts yet. Use the Chrome extension to enhance prompts!</div>}
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between animate__animated animate__fadeIn">
                <div className="flex-1">
                  <div className="font-bold text-yellow-900 mb-1 flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" />{prompt.title}</div>
                  <div className="text-yellow-800 text-sm mb-1">{prompt.body}</div>
                  {prompt.enhanced_text && <div className="text-green-700 text-xs mt-1">Enhanced: {prompt.enhanced_text}</div>}
                </div>
                <div className="flex flex-col items-end mt-2 md:mt-0 md:ml-4">
                  <span className="text-xs text-yellow-600">{prompt.category}</span>
                  <span className="text-xs text-yellow-400">{new Date(prompt.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [showAskFirst, setShowAskFirst] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <AuthContext.Consumer>
          {({ user, token, login, register, logout, loading }) => {
            if (loading) {
              return (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <p>Loading...</p>
                  </div>
                </div>
              )
            }

            if (!user) {
              return <AuthForm onLogin={login} onRegister={register} />
            }

            return (
              <>
                <Header 
                  user={user} 
                  logout={logout}
                />
                <Dashboard 
                  user={user} 
                  token={token}
                />
              </>
            )
          }}
        </AuthContext.Consumer>
      </div>
    </AuthProvider>
  )
}
// Add these new components after your existing components

// Enhanced Status Indicator Component
function StatusIndicator({ status, message }) {
  const statusConfig = {
    success: { color: 'text-green-400', icon: '✅', bg: 'bg-green-500/10' },
    warning: { color: 'text-yellow-400', icon: '⚠️', bg: 'bg-yellow-500/10' },
    error: { color: 'text-red-400', icon: '❌', bg: 'bg-red-500/10' },
    info: { color: 'text-blue-400', icon: 'ℹ️', bg: 'bg-blue-500/10' }
  }
  
  const config = statusConfig[status] || statusConfig.info
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg} ${config.color} text-sm font-medium`}>
      <span>{config.icon}</span>
      <span>{message}</span>
    </div>
  )
}

// Enhanced Progress Bar Component
function ProgressBar({ progress, label }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-sm font-mono text-white/60">{progress}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Enhanced Floating Action Button
function FloatingActionButton({ onClick, icon, label, variant = 'primary' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
  }
  
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-8 right-8 z-50
        ${variants[variant]}
        text-white font-semibold
        px-6 py-4 rounded-full
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        transition-all duration-200
        flex items-center gap-3
        backdrop-blur-sm
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

// Enhanced Tooltip Component
function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false)
  
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-3 py-2 text-sm font-medium text-white
          bg-black/90 backdrop-blur-sm rounded-lg shadow-lg
          whitespace-nowrap ${positions[position]}
          animate-in fade-in-0 zoom-in-95 duration-200
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-black/90 transform rotate-45
            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
          `} />
        </div>
      )}
    </div>
  )
}

// Add yellow pixel star SVG
const PixelStar = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 float-animation">
    <rect x="20" y="4" width="8" height="8" fill="#FFD600"/>
    <rect x="16" y="8" width="16" height="8" fill="#FFD600"/>
    <rect x="12" y="16" width="24" height="8" fill="#FFD600"/>
    <rect x="8" y="24" width="32" height="8" fill="#FFD600"/>
    <rect x="12" y="32" width="24" height="8" fill="#FFD600"/>
    <rect x="16" y="40" width="16" height="4" fill="#FFD600"/>
  </svg>
)

export default App

