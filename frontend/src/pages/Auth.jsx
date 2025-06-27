"use client";

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import AuthCard from '@/components/AuthCard'
import StarsCanvas from '@/components/StarsCanvas'
import { Logo } from '@/components/icons'

export default function Auth() {
  const [mode, setMode] = useState('sign-in')
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-nebula-gradient text-white antialiased relative overflow-hidden">
      {/* Particle Field Background */}
      <StarsCanvas particleCount={200} speed={0.2} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <Logo className="h-12 w-12 text-brand-green" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Welcome to Prompto
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
              className="mt-1 text-lg text-slate-400"
            >
              {mode === 'sign-in' ? 'Sign in to your account' : 'Create your account'}
            </motion.h2>
          </div>

          {/* Auth Card with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.4 }}
            className="glass rounded-2xl p-8 border-glow ring-0 ring-emerald-500/30"
          >
            <AuthCard mode={mode} />
            
            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                {mode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button
                  onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
                  className="text-brand-green hover:text-brand-green-light font-medium transition-colors text-base min-h-[44px] inline-flex items-center underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded px-1"
                >
                  {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: shouldReduceMotion ? 0 : 0.6 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => window.location.href = '/'}
              className="text-base text-slate-500 hover:text-slate-300 transition-colors min-h-[44px] inline-flex items-center underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded px-2"
            >
              ← Back to home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
