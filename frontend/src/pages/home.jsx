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
import Footer from "@/components/ui/footer"
import PromptDemoMono from "@/components/PromptDemoMono"
import FeatureCard from "@/components/FeatureCard"
import Counter from "@/components/Counter"
import CTA from "@/components/CTA"

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
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-radial from-slate-900 via-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2 text-base sm:text-lg font-medium text-slate-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 mr-2 text-green-400" />
            LLM-turbo for text
          </p>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turn messy thoughts<br />
            <span className="bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent">
              into killer prompts
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Slash token spend, keep every ounce of meaning. Plays nice with GPT-4, Claude, Gemini — whatever you feed it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full shadow-lg"
              onClick={onGetStarted}
            >
              Boost my prompt
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full"
              onClick={() => window.location.href = '/demo'}
            >
              30-sec demo
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Two Optimization Methods */}
      <PromptDemoMono />

      {/* Unified Features → Stats → CTA Band */}
      <section className="relative isolate overflow-hidden py-24 md:py-32 bg-slate-900">
        {/* Grain texture overlay */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none" />
        
        <div className="relative container mx-auto px-4">
          {/* Section intro */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why choose Prompt Copilot?
            </h2>
            <p className="text-xl text-slate-300">
              Advanced AI optimization for all your prompting needs
            </p>
          </div>

          {/* 1️⃣ Feature cards with glassmorphism */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Counter
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ CTA banner with sparkles */}
      <CTA
        headline="Let's supercharge your prompt right now"
        sub="Skip the card, save the cash, blow their minds."
        primary={{ 
          text: "Boost my prompt", 
          href: "/auth",
          icon: Sparkles 
        }}
        secondary={{ 
          text: "30-second tour", 
          href: "/demo" 
        }}
      />

      {/* Footer */}
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
    </div>
  )
}
