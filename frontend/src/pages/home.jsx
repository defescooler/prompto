import { useEffect } from "react"
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Users,
  Clock,
  Github,
  Twitter,
  Zap,
  Cpu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import Section from "@/components/ui/section"
import Footer from "@/components/ui/footer"
import PromptDemoMono from "@/components/PromptDemoMono"
import FeatureCard from "@/components/FeatureCard"
import Stat from "@/components/ui/stat"
import CTA from "@/components/CTA"
import { Component as PricingSection } from "@/components/ui/squishy-pricing"
import AnimatedBackground from "@/components/AnimatedBackground"
import HomeNavbar from "@/components/HomeNavbar"
import { Logo } from "@/components/icons.jsx"
import { tokens } from "@/lib/tokens"
import { cn } from "@/lib/utils"

export default function Home({ onGetStarted }) {
  /* ---------- helpers ---------- */
  const scrollTo = id => {
    const node = document.getElementById(id)
    if (node) node.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => (document.documentElement.style.scrollBehavior = "auto")
  }, [])

  const stats = [
    { label: 'Prompts zapped', value: 10000, suffix: '+', icon: Sparkles },
    { label: 'Fat trimmed', value: 60, suffix: '%', icon: TrendingDown },
    { label: 'Humans smiling', value: 500, suffix: '+', icon: Users },
    { label: 'Time alive', value: 99.9, suffix: '%', icon: Clock }
  ]

  const features = [
    {
      title: '60% Token Diet',
      blurb: 'Lose weight—keep brains.',
      icon: TrendingDown,
      accent: 'from-emerald-500/30 to-emerald-500/5'
    },
    {
      title: 'AI-Turbo',
      blurb: 'Context? Nuance? Sorted.',
      icon: Cpu,
      accent: 'from-blue-500/30 to-blue-500/5'
    },
    {
      title: 'Plugs Anywhere',
      blurb: 'GPT-4, Claude, Gemini—same button.',
      icon: Zap,
      accent: 'from-purple-500/30 to-purple-500/5'
    }
  ]

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-[#0e1629] text-slate-100 antialiased">
      <HomeNavbar />
      {/* Hero Section */}
      <AnimatedBackground shapes="circles" speed={0.8} variant="blend">
        <Section 
          id="hero" 
          className="relative min-h-[90vh] flex flex-col items-center justify-center text-center bg-gradient-radial from-slate-900 via-slate-900 to-slate-800"
          maxWidth={false}
          spacing={false}
        >
          <div className="max-w-4xl mx-auto">
            <p className={cn(
              "mb-2 font-medium flex items-center justify-center",
              tokens.typography.body,
              tokens.colors.text.muted
            )}>
              <Sparkles className={cn(tokens.icon.className, "mr-2")} />
              LLM-turbo for text
            </p>
            
            <h1 className={cn(
              tokens.typography.display,
              tokens.colors.text.primary,
              "mb-6 font-bold tracking-tight"
            )}>
              <span className="inline-block animate-in fade-in-50 slide-in-from-bottom-8 duration-1000">
                Turn messy thoughts
              </span>
              <br />
              <span className="relative inline-block animate-in fade-in-50 slide-in-from-bottom-8 duration-1000 delay-200">
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-lime-400 bg-clip-text text-transparent animate-pulse">
                  into killer prompts
                </span>
                {/* Subtle glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-emerald-300/20 to-lime-400/20 blur-2xl -z-10" />
              </span>
            </h1>
            
            <p className={cn(
              tokens.typography['body-lg'],
              tokens.colors.text.secondary,
              "mb-12 max-w-2xl mx-auto animate-in fade-in-50 slide-in-from-bottom-8 duration-1000 delay-300 leading-relaxed"
            )}>
              Slash token spend, keep every ounce of meaning. Plays nice with GPT-4, 
              Claude, Gemini — whatever you feed it.
            </p>
            
            <div className="flex justify-center mb-16 animate-in fade-in-50 slide-in-from-bottom-8 duration-1000 delay-500">
              <button
                onClick={() => window.location.href = '/auth'}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-full transition-all duration-500 hover:bg-white/10 hover:border-emerald-500/30 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-400/0 to-lime-400/0 group-hover:from-emerald-500/10 group-hover:via-emerald-400/10 group-hover:to-lime-400/10 transition-all duration-500" />
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 group-hover:animate-spin transition-transform duration-500" />
                  Boost my prompt
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>
          </div>
        </Section>
      </AnimatedBackground>

      {/* Two Optimization Methods */}
      <AnimatedBackground shapes="rects" speed={1.2} variant="dark">
        <div id="demo">
          <PromptDemoMono />
        </div>
      </AnimatedBackground>

      {/* Unified Features → Stats → CTA Band */}
      <AnimatedBackground shapes="triangles" speed={0.6} variant="blend">
        <Section id="features" className="bg-slate-900">
          {/* Grain texture overlay */}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none" />
          
          <div className="relative">
            {/* Section intro */}
            <div className="text-center mb-16">
              <h2 className={cn(tokens.typography.headline, tokens.colors.text.primary, "mb-4")}>
                Why choose Prompt Copilot?
              </h2>
              <p className={cn(tokens.typography['body-lg'], tokens.colors.text.secondary)}>
                Advanced AI optimization for all your prompting needs
              </p>
            </div>

            {/* 1️⃣ Feature cards with glassmorphism */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  blurb={feature.blurb}
                  icon={feature.icon}
                  accent={feature.accent}
                />
              ))}
            </div>

            {/* Hairline divider */}
            <div className="mb-20 h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

            {/* 2️⃣ KPI counters with count-up animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <Stat
                  key={index}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>
        </Section>
      </AnimatedBackground>

      {/* Pricing Section */}
      <AnimatedBackground shapes="circles" speed={1.0} variant="light">
        <div id="pricing">
          <PricingSection />
        </div>
      </AnimatedBackground>

      {/* 3️⃣ CTA banner with sparkles */}
      <AnimatedBackground shapes="rects" speed={0.5} variant="blend">
        <CTA
          headline="Ready to supercharge your prompts?"
          sub="Join thousands of users saving time and money with AI optimization."
          primary={{ 
            text: "Start Free Trial", 
            href: "/auth",
            icon: Sparkles 
          }}
          secondary={{ 
            text: "See how it works", 
            href: "/demo" 
          }}
        />
      </AnimatedBackground>

      {/* Footer */}
      <AnimatedBackground shapes="triangles" speed={0.3} variant="dark">
        <Footer
          socialLinks={[
            {
              icon: <Twitter className="h-5 w-5" />,
              href: "https://twitter.com/defescooler",
              label: "Twitter",
            },
            {
              icon: <Github className="h-5 w-5" />,
              href: "https://github.com/defescooler",
              label: "GitHub",
            },
          ]}
          mainLinks={[
            { href: "#features", label: "Features" },
            { href: "/demo", label: "Demo" },
            { href: "/dashboard", label: "Dashboard" },
          ]}
          legalLinks={[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
          ]}
          copyright={{
            text: "Made with ❤️ by",
            license: (
              <a
                href="https://github.com/defescooler"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-white"
              >
                defescooler
              </a>
            ),
          }}
        />
      </AnimatedBackground>
    </div>
  )
}
