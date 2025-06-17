import { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Brain, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Import auth context
import { AuthContext } from '../App.jsx'

export default function Auth() {
  const navigate = useNavigate()
  const { login, register } = useContext(AuthContext)
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
      let result
      
      if (isLogin) {
        // Login
        result = await login({
          username_or_email: formData.username,
          password: formData.password
        })
      } else {
        // Register
        result = await register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      }
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join Prompt Copilot'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  autoComplete="name" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required 
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                {isLogin ? 'Username or Email' : 'Username'}
              </Label>
              <Input 
                id="username" 
                type="text" 
                autoComplete="username" 
                value={formData.username} 
                onChange={e => setFormData({ ...formData, username: e.target.value })} 
                required 
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  autoComplete="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  required 
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                autoComplete={isLogin ? 'current-password' : 'new-password'} 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                required 
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-center text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button 
                  type="button"
                  className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  type="button"
                  className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
