import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

import { Logo } from './components/icons.jsx'

// Import page components
import Home from './pages/home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SimpleDashboard from './pages/SimpleDashboard.jsx'
import TestDashboard from './pages/TestDashboard.jsx'
import DebugDashboard from './pages/DebugDashboard.jsx'
import WorkingDashboard from './pages/WorkingDashboard.jsx'
import Auth from './pages/Auth.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import NotFound from './pages/NotFound.jsx'

// API Configuration - Updated for Flask backend
const API_BASE_URL = 'http://localhost:8002'

// Authentication Context
export const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetch(`${API_BASE_URL}/api/auth/me`, {
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
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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

// Hook to use auth context
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Logo className="h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/auth" replace />
}

// Page Transition Component
function PageTransition({ children }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Main App Component
function App() {
  const { user, token, logout, loading } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <Home />
            </PageTransition>
          </div>
        } />
        <Route path="/dashboard" element={
          <WorkingDashboard />
        } />
        <Route path="/dashboard-test" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <TestDashboard />
            </PageTransition>
          </div>
        } />
        <Route path="/dashboard-protected" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/auth/sign-in" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <SignIn />
            </PageTransition>
          </div>
        } />
        <Route path="/auth/sign-up" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <SignUp />
            </PageTransition>
          </div>
        } />
        <Route path="/auth" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <Auth />
            </PageTransition>
          </div>
        } />
        <Route path="/404" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <NotFound />
            </PageTransition>
          </div>
        } />
        <Route path="*" element={
          <div className="min-h-screen bg-slate-950">
            <PageTransition>
              <NotFound />
            </PageTransition>
          </div>
        } />
      </Routes>
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


