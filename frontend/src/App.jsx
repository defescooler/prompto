import { useState, useEffect, createContext, useContext, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

import { Logo } from './components/icons.jsx'

// Lazy load page components for better performance
const Home = lazy(() => import('./pages/home.jsx'))
const WorkingDashboard = lazy(() => import('./pages/WorkingDashboard.jsx'))
const Auth = lazy(() => import('./pages/Auth.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// API Configuration - Updated for Flask backend
const API_BASE_URL = 'http://localhost:8002'

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-surface-darker flex items-center justify-center">
    <div className="text-center">
      <Logo className="h-12 w-12 mx-auto mb-4 text-brand-green motion-safe:animate-pulse" />
      <p className="text-slate-400 font-mono">Loading...</p>
    </div>
  </div>
)

// Authentication Context
export const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  const validateSession = async (currentToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      })
      
      if (!response.ok) {
        throw new Error('Session validation failed')
      }
      
      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
        setAuthError(null)
        return true
      } else {
        throw new Error('Invalid user data')
      }
    } catch (error) {
      console.error('Session validation error:', error)
      setAuthError('Session expired. Please sign in again.')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await validateSession(token)
      }
      setLoading(false)
    }
    
    initAuth()
  }, [token])

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        setAuthError(null)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        setAuthError(null)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setAuthError(null)
  }

  const refreshSession = async () => {
    if (token) {
      return await validateSession(token)
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      loading, 
      authError,
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Component with enhanced error handling
function ProtectedRoute({ children }) {
  const { user, loading, authError, refreshSession } = useAuth()
  const [sessionChecked, setSessionChecked] = useState(false)
  
  useEffect(() => {
    const checkSession = async () => {
      if (!loading && !user && !authError) {
        // Try to refresh session one more time
        const isValid = await refreshSession()
        if (!isValid) {
          // Session is truly invalid, will redirect to auth
        }
      }
      setSessionChecked(true)
    }
    
    checkSession()
  }, [loading, user, authError, refreshSession])
  
  if (loading || !sessionChecked) {
    return <LoadingFallback />
  }
  
  if (authError || !user) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

// Optimized Page Transition Component
function PageTransition({ children }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-surface-darker">
              <PageTransition>
                <Home />
              </PageTransition>
            </div>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <WorkingDashboard />
            </ProtectedRoute>
          } />
          <Route path="/auth" element={
            <div className="min-h-screen bg-surface-darker">
              <PageTransition>
                <Auth />
              </PageTransition>
            </div>
          } />
          <Route path="/404" element={
            <div className="min-h-screen bg-surface-darker">
              <PageTransition>
                <NotFound />
              </PageTransition>
            </div>
          } />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

// Wrap with AuthProvider
export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}


