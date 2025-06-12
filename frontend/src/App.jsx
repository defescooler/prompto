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
import logo from './assets/logo.png'
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
function Header({ user, logout, showAskFirst, setShowAskFirst }) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Prompt Copilot" className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Prompt Copilot
            </h1>
            <p className="text-sm text-gray-600">AI-Powered Prompt Enhancement</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant={showAskFirst ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAskFirst(!showAskFirst)}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Ask me first</span>
          </Button>
          
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="Prompt Copilot" className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join Prompt Copilot'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">{isLogin ? 'Username or Email' : 'Username'}</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dashboard Component
function Dashboard({ user, token, showAskFirst, setShowAskFirst }) {
  const [prompts, setPrompts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [newPrompt, setNewPrompt] = useState({ title: '', body: '', category: 'general' })
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [enhancing, setEnhancing] = useState(false)
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

  const enhancePrompt = async (promptText) => {
    if (showAskFirst) {
      const confirmed = window.confirm('Do you want to enhance this prompt using AI?')
      if (!confirmed) return
    }

    setEnhancing(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/enhance-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: promptText, user_id: user.id })
      })
      const data = await response.json()
      setEnhancedPrompt(data.enhanced)
      fetchAnalytics() // Refresh analytics
    } catch (error) {
      console.error('Error enhancing prompt:', error)
    } finally {
      setEnhancing(false)
    }
  }

  const savePrompt = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPrompt,
          enhanced_text: enhancedPrompt
        })
      })
      
      if (response.ok) {
        setNewPrompt({ title: '', body: '', category: 'general' })
        setEnhancedPrompt('')
        fetchPrompts()
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
    }
  }

  const toggleFavorite = async (promptId) => {
    try {
      await fetch(`${API_BASE_URL}/api/prompts/${promptId}/favorite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPrompts()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prompts Enhanced</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.analytics?.prompts_enhanced || 0}</div>
                <p className="text-xs text-muted-foreground">Total enhancements</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.time_saved_formatted || '0m 0s'}</div>
                <p className="text-xs text-muted-foreground">Estimated time saved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.favorite_prompts || 0}/10</div>
                <p className="text-xs text-muted-foreground">Favorite prompts</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI Prompt Enhancer</span>
              </CardTitle>
              <CardDescription>
                Transform your prompts with AI-powered enhancements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt-input">Your Prompt</Label>
                <Textarea
                  id="prompt-input"
                  placeholder="Enter your prompt here..."
                  value={newPrompt.body}
                  onChange={(e) => setNewPrompt({...newPrompt, body: e.target.value})}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={() => enhancePrompt(newPrompt.body)}
                disabled={!newPrompt.body || enhancing}
                className="w-full"
              >
                {enhancing ? 'Enhancing...' : '✨ Enhance Prompt'}
              </Button>
              
              {enhancedPrompt && (
                <div className="space-y-2">
                  <Label>Enhanced Prompt</Label>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm">{enhancedPrompt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Prompt title..."
                      value={newPrompt.title}
                      onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
                    />
                    <Select value={newPrompt.category} onValueChange={(value) => setNewPrompt({...newPrompt, category: value})}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={savePrompt}>Save</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{prompt.category}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(prompt.id)}
                      >
                        <Heart className={`w-4 h-4 ${prompt.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{prompt.body}</p>
                  {prompt.enhanced_text && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-medium text-blue-800">Enhanced:</p>
                      <p className="text-sm text-blue-700">{prompt.enhanced_text}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <div className="grid gap-4">
            {prompts.filter(p => p.is_favorite).map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>{prompt.title}</span>
                    </CardTitle>
                    <Badge variant="secondary">{prompt.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{prompt.enhanced_text || prompt.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Prompts:</span>
                  <span className="font-bold">{analytics?.total_prompts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enhanced Prompts:</span>
                  <span className="font-bold">{analytics?.analytics?.prompts_enhanced || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-bold">{analytics?.analytics?.success_rate || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Saved:</span>
                  <span className="font-bold">{analytics?.time_saved_formatted || '0m 0s'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Username:</span>
                  <span className="font-bold">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-bold">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Type:</span>
                  <Badge variant={user?.is_premium ? "default" : "secondary"}>
                    {user?.is_premium ? "Premium" : "Free"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="font-bold">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
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
                    <img src={logo} alt="Prompt Copilot" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
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
                  showAskFirst={showAskFirst}
                  setShowAskFirst={setShowAskFirst}
                />
                <Dashboard 
                  user={user} 
                  token={token}
                  showAskFirst={showAskFirst}
                  setShowAskFirst={setShowAskFirst}
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

// Update your PromptEnhancement component to include these new features:
function PromptEnhancement({ token }) {
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [enhancementProgress, setEnhancementProgress] = useState(0)
  const [status, setStatus] = useState(null)
  const textareaRef = useRef(null)

  // Add keyboard shortcuts
  useKeyboardShortcuts(textareaRef, setOriginalPrompt, originalPrompt)

  const enhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      setStatus({ type: 'warning', message: 'Please enter a prompt to enhance' })
      return
    }

    setIsEnhancing(true)
    setEnhancementProgress(0)
    setStatus({ type: 'info', message: 'Starting enhancement...' })
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch(`${API_BASE_URL}/api/enhance-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: originalPrompt })
      })

      const data = await response.json()
      
      clearInterval(progressInterval)
      setEnhancementProgress(100)
      
      if (data.enhanced) {
        setEnhancedPrompt(data.enhanced)
        setShowComparison(true)
        setStatus({ type: 'success', message: 'Prompt enhanced successfully!' })
      } else {
        setStatus({ type: 'error', message: 'Enhancement failed. Please try again.' })
      }
    } catch (error) {
      clearInterval(progressInterval)
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' })
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
      setTimeout(() => {
        setEnhancementProgress(0)
        setStatus(null)
      }, 3000)
    }
  }

  // ... rest of your existing component code

  return (
    <div className="fire-enhancement-container">
      <Card className="fire-enhancement-card">
        <CardHeader className="fire-enhancement-header">
          <div className="fire-enhancement-header-content">
            <div className="fire-enhancement-title-section">
              <CardTitle className="fire-enhancement-title">
                <Wand2 className="w-6 h-6 mr-2" />
                Enhance Your Prompt
                <Flame className="w-5 h-5 ml-2 text-orange-500" />
              </CardTitle>
              <CardDescription>
                Transform your prompts with AI magic ✨
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <KeyboardShortcutsHelp />
              <Tooltip content="Save your enhanced prompts">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="fire-enhancement-content">
          {/* Status Indicator */}
          {status && (
            <div className="mb-6">
              <StatusIndicator status={status.type} message={status.message} />
            </div>
          )}
          
          {/* Progress Bar */}
          {isEnhancing && (
            <div className="mb-6">
              <ProgressBar progress={enhancementProgress} label="Enhancing prompt..." />
            </div>
          )}
          
          <div className="fire-prompt-input-section">
            <Label htmlFor="prompt-input" className="fire-input-label">
              Your Prompt
            </Label>
            <Textarea
              ref={textareaRef}
              id="prompt-input"
              placeholder="Enter your prompt here... Use Ctrl+A to select all, Ctrl+D to duplicate lines, Ctrl+/ to comment"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="fire-prompt-textarea"
              rows={8}
            />
            
            <div className="fire-prompt-actions">
              <Button
                onClick={enhancePrompt}
                disabled={isEnhancing || !originalPrompt.trim()}
                className="fire-enhance-btn"
              >
                {isEnhancing ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Enhance Prompt
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setOriginalPrompt('')
                  setEnhancedPrompt('')
                  setShowComparison(false)
                  textareaRef.current?.focus()
                }}
                className="fire-reset-btn"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              {showComparison && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOriginalPrompt(enhancedPrompt)
                    setShowComparison(false)
                    textareaRef.current?.focus()
                  }}
                  className="fire-apply-btn"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Enhanced
                </Button>
              )}
            </div>
          </div>

          {/* Rest of your comparison section... */}
        </CardContent>
      </Card>
      
      {/* Floating Action Button for quick actions */}
      <FloatingActionButton
        onClick={() => textareaRef.current?.focus()}
        icon={<Sparkles className="w-5 h-5" />}
        label="Quick Enhance"
        variant="primary"
      />
    </div>
  )
}

export default App

