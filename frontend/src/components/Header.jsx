import { motion } from 'framer-motion'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/icons'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleAuth = (mode) => {
    // Navigate to auth page
    window.location.href = '/auth'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/20 border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Logo className="h-7 w-7 text-brand-green" />
            <span className="text-lg font-bold text-white">Prompto</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/70 hover:text-white transition-colors font-medium text-sm"
              >
                Pricing
              </button>
              <a
                href="/dashboard"
                className="text-white/70 hover:text-white transition-colors font-medium text-sm"
              >
                Dashboard
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => handleAuth('sign-in')}
                className="px-4 py-2 h-9 rounded-button border border-white/15 hover:border-white/30 bg-transparent hover:bg-white/5 text-white/80 hover:text-white font-medium text-sm transition-all duration-200"
              >
                Log In
              </Button>
              <Button
                onClick={() => handleAuth('sign-up')}
                className="px-4 py-2 h-9 rounded-button bg-gradient-to-r from-brand-green to-emerald-400 hover:from-emerald-400 hover:to-brand-green text-white font-semibold text-sm shadow-lg hover:shadow-brand-green/25 transition-all duration-200"
              >
                Start Free
              </Button>
            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-md"
          >
            <div className="py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-white/70 hover:text-white transition-colors font-medium py-2 text-sm"
                >
                  Pricing
                </button>
                <a
                  href="/dashboard"
                  className="block text-white/70 hover:text-white transition-colors font-medium py-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </a>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleAuth('sign-in')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full py-3 h-12 rounded-card border border-white/15 hover:border-white/30 bg-transparent hover:bg-white/5 text-white/80 hover:text-white font-medium"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => {
                    handleAuth('sign-up')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full py-3 h-12 rounded-card bg-gradient-to-r from-brand-green to-emerald-400 hover:from-emerald-400 hover:to-brand-green text-white font-semibold shadow-lg hover:shadow-brand-green/25"
                >
                  Start Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header 