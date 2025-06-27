"use client";

import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AuthContext } from '../App'

// Google Icon Component
function GoogleIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  );
}

// Apple Icon Component  
function AppleIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

// Validation Schemas
const signInSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});



export default function Auth() {
  const [mode, setMode] = useState('sign-in')
  const [showPassword, setShowPassword] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const { login, register } = useContext(AuthContext)

  const schema = mode === 'sign-in' ? signInSchema : signUpSchema
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    shouldUnregister: false
  })

  const onSubmit = async (data, event) => {
    event?.preventDefault()
    
    try {
      console.log('=== FORM SUBMISSION START ===')
      console.log('Mode:', mode)
      console.log('Form data:', data)
      
      // Use AuthContext functions instead of direct API calls
      const result = mode === 'sign-in' 
        ? await login({ email: data.email, password: data.password })
        : await register({ name: data.name, email: data.email, password: data.password })
      
      console.log('=== AUTH CONTEXT RESULT ===', result)
      
      if (!result.success) {
        console.error('Authentication failed:', result.error)
        toast.error(result.error || 'Authentication failed')
        return
      }

      console.log('=== SUCCESS - NAVIGATING ===')
      toast.success(mode === 'sign-in' ? `Welcome back!` : 'Account created successfully!')
      
      // Immediate navigation
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===', error)
      toast.error(error.message || 'Something went wrong. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    toast("Google sign-in coming soon!")
  }

  const handleAppleSignIn = async () => {
    toast("Apple sign-in coming soon!")
  }

  const toggleMode = () => {
    setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')
    clearErrors()
    setShowPassword(false)
  }

  // Handle schema changes when mode changes
  useEffect(() => {
    clearErrors()
  }, [mode, clearErrors])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.6 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome{mode === 'sign-up' ? '!' : ' back!'}
          </h1>
          <p className="text-lg text-slate-400">
            {mode === 'sign-in' 
              ? 'Log in to Prompto to continue to Prompto.' 
              : 'Create your Prompto account to get started.'
            }
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full h-12 bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-3 rounded-xl"
          >
            <GoogleIcon className="w-5 h-5" />
            {mode === 'sign-in' ? 'Log in with Google' : 'Sign up with Google'}
          </Button>

          <Button
            onClick={handleAppleSignIn}
            variant="outline"
            className="w-full h-12 bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-3 rounded-xl"
          >
            <AppleIcon className="w-5 h-5" />
            {mode === 'sign-in' ? 'Log in with Apple' : 'Sign up with Apple'}
          </Button>
        </div>

        {/* OR Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-6 bg-slate-950 text-slate-400 font-medium">OR</span>
          </div>
        </div>

        {/* Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(onSubmit)(e)
          }} 
          className="space-y-6"
        >
          {mode === 'sign-up' && (
            <div>
              <Label htmlFor="name" className="text-white font-medium mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                className="w-full h-12 bg-white/95 border-slate-700 text-black placeholder:text-slate-400 focus:border-brand-green focus:ring-brand-green rounded-xl"
                {...registerField('name')}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name?.message}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-white font-medium mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              className="w-full h-12 bg-white/95 border-slate-700 text-black placeholder:text-slate-400 focus:border-brand-green focus:ring-brand-green rounded-xl"
              {...registerField('email')}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email?.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password" className="text-white font-medium">
                Password
              </Label>
              {mode === 'sign-in' && (
                <button
                  type="button"
                  className="text-slate-400 hover:text-white text-sm underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                className="w-full h-12 bg-white/95 border-slate-700 text-black placeholder:text-slate-400 focus:border-brand-green focus:ring-brand-green rounded-xl pr-12"
                {...registerField('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password?.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Please wait...
              </div>
            ) : (
              mode === 'sign-in' ? 'Log in' : 'Sign up'
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center">
          <p className="text-slate-400">
            {mode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={toggleMode}
              className="text-white font-medium hover:underline"
            >
              {mode === 'sign-in' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  )
}
