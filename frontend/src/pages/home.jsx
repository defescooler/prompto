import { motion } from 'framer-motion'
import { Sparkles, ArrowRightIcon, ChevronDown, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Component as PricingSection } from '@/components/ui/squishy-pricing'
import StarsCanvas from '@/components/StarsCanvas'
import Footer from '@/components/ui/footer'
import VideoDemo from '@/components/VideoDemo'

export default function Home() {
  // Animation variants for Framer Motion choreography
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-nebula-gradient text-white antialiased overflow-x-hidden">


      {/* Go to App Button - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-6 right-6 z-50"
      >
        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="group flex items-center gap-2 px-4 py-2 rounded-button bg-black/40 backdrop-blur-md border border-white/20 hover:border-brand-green/40 text-white hover:text-brand-green transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <span className="font-semibold text-sm">Go to App</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Button>
      </motion.div>
      
      {/* Particle Field Background */}
      <StarsCanvas particleCount={120} speed={0.3} />
      
      {/* Hero Section */}
      <section className="relative isolate min-h-screen grid place-content-center text-center px-6 py-20 scroll-mt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Chrome Extension Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <button
              onClick={() => {
                // Open Chrome Web Store for the extension
                window.open('https://chrome.google.com/webstore/category/extensions', '_blank')
              }}
              className="group transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl"
            >
                             <img 
                 src="/chrome.svg" 
                 alt="Available in the Chrome Web Store" 
                 className="w-auto h-12 group-hover:brightness-110 transition-all duration-300 mx-auto"
               />
            </button>
          </motion.div>

          {/* Prompto Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <img 
              src="/prompto-logo-white.svg" 
              alt="Prompto" 
              className="w-auto h-16 mx-auto opacity-90"
            />
          </motion.div>



          {/* Main Heading - Proper H1 with strong hierarchy */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(3rem,6vw,6rem)] font-extrabold leading-[0.9] tracking-tight mb-8"
          >
            Turn messy thoughts
            <br />
            <span className="relative inline-block">
              {/* High contrast gradient optimized for readability */}
              <span className="relative z-10 bg-gradient-to-r from-white via-emerald-200 to-brand-green bg-clip-text text-transparent">
                into killer prompts
              </span>
              {/* Strong backdrop for contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-emerald-200/40 to-brand-green/40 blur-2xl -z-10" />
            </span>
          </motion.h1>

          {/* Subtitle with improved contrast */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Slash token spend by 60% while keeping every ounce of meaning.
            <br className="hidden md:block" />
            We integrate advanced AI into your prompt environment.
          </motion.p>

          {/* Single Primary CTA - Following conversion best practices */}
          <motion.div
            variants={buttonVariants}
            className="mb-16"
          >
            <Button
              onClick={() => window.location.href = '/auth'}
              size="lg"
              className="group relative min-w-[280px] h-[64px] px-10 py-5 rounded-button bg-gradient-to-r from-brand-green to-emerald-400 hover:from-emerald-400 hover:to-brand-green text-white font-bold transition-all duration-300 hover:scale-105 border-0 text-lg shadow-2xl shadow-brand-green/30 hover:shadow-brand-green/50"
            >
              <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin transition-transform duration-300" />
              Boost my prompt
              <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              {/* Enhanced hover glow */}
              <div className="absolute inset-0 rounded-button bg-gradient-to-r from-brand-green/30 to-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
            </Button>
          </motion.div>

          {/* Subtle Scroll Hint - Single conversion cue */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <button
              onClick={() => {
                document.querySelector('#pricing')?.scrollIntoView({ 
                  behavior: 'smooth' 
                })
              }}
              className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity group"
            >
              <span className="text-sm text-white/80 font-medium">See pricing</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="group-hover:text-brand-green transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Video Demo Section */}
      <VideoDemo />

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/60 to-surface-darker" />
        <div className="relative z-10">
          <PricingSection />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
