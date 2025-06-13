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
import { Sparkles, Heart, BarChart3, Settings, User, LogOut, CheckCircle, Zap, Clock, TrendingUp, Star, BookOpen } from 'lucide-react'
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
    <header className="border-b border-purple-100 bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            {/* Pixel Star - simplified */}
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
              <rect x="20" y="4" width="8" height="8" fill="currentColor"/>
              <rect x="16" y="8" width="16" height="8" fill="currentColor"/>
              <rect x="12" y="16" width="24" height="8" fill="currentColor"/>
              <rect x="8" y="24" width="32" height="8" fill="currentColor"/>
              <rect x="12" y="32" width="24" height="8" fill="currentColor"/>
              <rect x="16" y="40" width="16" height="4" fill="currentColor"/>
            </svg>
          <div>
              <h1 className="text-xl font-bold text-purple-700">
              Prompt Copilot
            </h1>
              <p className="text-xs font-medium text-purple-500">
                AI-Powered Prompt Enhancement
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Removed fancy purple badge and replaced with a simple text link for flair */}
          <a href="#" className="text-purple-600 hover:text-purple-800 text-sm font-semibold transition-colors duration-200">Dashboard</a>
          {user && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1 bg-purple-100 text-purple-700">
                <User className="w-3 h-3" />
                <span>{user.username}</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={logout} className="text-purple-600 hover:bg-purple-50 hover:text-purple-800">
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
    <div className="gradient-bg p-8 font-sans flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md glass shadow-lg rounded-xl border border-purple-100">
        <CardHeader className="flex flex-col items-center pb-4">
          <PixelStar className="text-purple-500 mb-2" width="36" height="36" />
          <CardTitle className="text-2xl font-bold text-purple-700 mb-1">
            {isLogin ? 'Sign In to Prompt Copilot' : 'Join Prompt Copilot'}
          </CardTitle>
          <CardDescription className="text-purple-500 text-sm">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-purple-700 text-sm font-medium mb-1">Full Name</Label>
                <Input id="name" type="text" autoComplete="name" value={formData.name} onChange={e => setFormData({ ...formData.name, name: e.target.value })} required className="rounded-md" />
              </div>
            )}
            <div>
              <Label htmlFor="username" className="text-purple-700 text-sm font-medium mb-1">Username or Email</Label>
              <Input id="username" type="text" autoComplete="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required className="rounded-md" />
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="email" className="text-purple-700 text-sm font-medium mb-1">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="rounded-md" />
              </div>
            )}
            <div>
              <Label htmlFor="password" className="text-purple-700 text-sm font-medium mb-1">Password</Label>
              <Input id="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required className="rounded-md" />
            </div>
            {error && <div className="text-red-600 text-center text-sm font-medium">{error || 'An error occurred. Please try again.'}</div>}
            <Button type="submit" className="w-full rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm transition-colors">{loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}</Button>
          </form>
          <div className="text-center text-sm text-purple-600 mt-3">
            {isLogin ? (
              <>Don&apos;t have an account? <span className="text-purple-700 hover:underline cursor-pointer font-semibold" onClick={() => setIsLogin(false)}>Sign up</span></>
            ) : (
              <>Already have an account? <span className="text-purple-700 hover:underline cursor-pointer font-semibold" onClick={() => setIsLogin(true)}>Sign in</span></>
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
      <div className="text-xs font-bold text-purple-800 tracking-wide uppercase drop-shadow-sm" style={{ letterSpacing: '0.04em' }}>{label}</div>
    </div>
  )

  // Pixel star animation
  const PixelStar = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 float-animation">
      <rect x="20" y="4" width="8" height="8" fill="var(--color-purple-400)"/>
      <rect x="16" y="8" width="16" height="8" fill="var(--color-purple-400)"/>
      <rect x="12" y="16" width="24" height="8" fill="var(--color-purple-400)"/>
      <rect x="8" y="24" width="32" height="8" fill="var(--color-purple-400)"/>
      <rect x="12" y="32" width="24" height="8" fill="var(--color-purple-400)"/>
      <rect x="16" y="40" width="16" height="4" fill="var(--color-purple-400)"/>
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

  // Cost, effectiveness, streaks
  const effectiveness = analytics?.analytics?.success_rate ? Math.round(analytics.analytics.success_rate * 100) / 100 : 0
  const cost = (analytics?.analytics?.prompts_enhanced || 0) * 0.002 // e.g., $0.002 per prompt
  const streak = Math.min(analytics?.analytics?.prompts_enhanced || 0, 7)

  return (
    <div className="gradient-bg py-10 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <PixelStar className="text-purple-500 mb-4" width="40" height="40" />
          <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-2">Dashboard</h1>
          <p className="text-md text-purple-600 font-medium text-center">Your AI prompt analytics, history, and stats</p>
          </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Enhanced" value={<AnimatedNumber value={analytics?.analytics?.prompts_enhanced || 0} />} icon={<Sparkles className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
          <StatCard label="Time Saved" value={analytics?.time_saved_formatted || '0m 0s'} icon={<Clock className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
          <StatCard label="Favorites" value={<AnimatedNumber value={analytics?.favorite_prompts || 0} />} icon={<Heart className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
          <StatCard label="Streak" value={<AnimatedNumber value={streak} />} icon={<Zap className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
              </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Effectiveness" value={effectiveness + '%'} icon={<TrendingUp className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
          <StatCard label="Cost" value={`$${cost.toFixed(2)}`} icon={<BarChart3 className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
          <StatCard label="Total Usage" value={<AnimatedNumber value={analytics?.analytics?.total_usage || 0} />} icon={<BarChart3 className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
          <StatCard label="Total Prompts" value={<AnimatedNumber value={analytics?.stats?.total_prompts || 0} />} icon={<BookOpen className="w-5 h-5 text-purple-500" />} color="var(--color-purple-600)" />
                  </div>
        <div className="glass p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center"><BookOpen className="w-5 h-5 text-purple-600 mr-2" />Prompt History</h2>
          <div className="max-h-80 overflow-y-auto space-y-4">
            {prompts.length === 0 && <div className="text-purple-600 text-center py-8">No prompts yet. Use the Chrome extension to enhance prompts!</div>}
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-purple-800 mb-1 flex items-center"><Star className="w-4 h-4 text-purple-400 mr-1" />{prompt.title}</div>
                  <div className="text-purple-700 text-sm mb-1">{prompt.body}</div>
                  {prompt.enhanced_text && <div className="text-green-700 text-xs mt-1">Enhanced: {prompt.enhanced_text}</div>}
                </div>
                <div className="flex flex-col items-end mt-2 md:mt-0 md:ml-4 text-sm">
                  <span className="text-purple-500">Category: {prompt.category}</span>
                  <span className="text-purple-400 text-xs mt-0.5">{new Date(prompt.created_at).toLocaleString()}</span>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 overflow-y-auto">
        <AuthContext.Consumer>
          {({ user, token, login, register, logout, loading }) => {
            if (loading) {
              return (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center text-purple-600">
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
    success: { color: 'text-green-600', icon: '✅', bg: 'bg-green-50' },
    warning: { color: 'text-orange-600', icon: '⚠️', bg: 'bg-orange-50' }, 
    error: { color: 'text-red-600', icon: '❌', bg: 'bg-red-50' },
    info: { color: 'text-blue-600', icon: 'ℹ️', bg: 'bg-blue-50' }
  }
  
  const config = statusConfig[status] || statusConfig.info
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${config.bg} ${config.color} text-sm font-medium border border-gray-200`}>
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
        <span className="text-sm font-medium text-purple-700">{label}</span>
        <span className="text-sm font-medium text-purple-500">{progress}%</span>
      </div>
      <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Enhanced Floating Action Button (simplified if not used or needed)
function FloatingActionButton({ onClick, icon, label, variant = 'primary' }) {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700'
  }
  
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-8 right-8 z-50
        ${variants[variant]}
        text-white font-semibold
        px-4 py-2 rounded-md
        shadow-md hover:shadow-lg
        transition-all duration-200
        flex items-center gap-2
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

// Enhanced Tooltip Component (simplified if not used or needed)
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
          absolute z-50 px-2 py-1 text-xs font-medium text-white
          bg-gray-800 rounded-md shadow-sm
          whitespace-nowrap ${positions[position]}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-gray-800 transform rotate-45
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

// Add purple pixel star SVG (simplified version)
const PixelStar = ({ className, width, height }) => (
  <svg width={width || "48"} height={height || "48"} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="4" width="8" height="8" fill="currentColor"/>
    <rect x="16" y="8" width="16" height="8" fill="currentColor"/>
    <rect x="12" y="16" width="24" height="8" fill="currentColor"/>
    <rect x="8" y="24" width="32" height="8" fill="currentColor"/>
    <rect x="12" y="32" width="24" height="8" fill="currentColor"/>
    <rect x="16" y="40" width="16" height="4" fill="currentColor"/>
  </svg>
)

export default App


