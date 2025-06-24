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
              "mb-6"
            )}>
              Turn messy thoughts<br />
              <span className={tokens.colors.text.accent}>
                into killer prompts
              </span>
            </h1>
            
            <p className={cn(
              tokens.typography['body-lg'],
              tokens.colors.text.secondary,
              "mb-8 max-w-2xl mx-auto"
            )}>
              Slash token spend, keep every ounce of meaning. Plays nice with GPT-4, Claude, Gemini — whatever you feed it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                variant="primary"
                onClick={onGetStarted}
              >
                Boost my prompt
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = '/demo'}
              >
                30-sec demo
                <Sparkles className={cn(tokens.icon.className, "ml-2")} />
              </Button>
            </div>
          </div>
        </Section>
      </AnimatedBackground>

      {/* Two Optimization Methods */}
      <AnimatedBackground shapes="rects" speed={1.2} variant="dark">
        <PromptDemoMono />
      </AnimatedBackground>

      {/* Unified Features → Stats → CTA Band */}
      <AnimatedBackground shapes="triangles" speed={0.6} variant="blend">
        <Section className="bg-slate-900">
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
        <PricingSection />
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
