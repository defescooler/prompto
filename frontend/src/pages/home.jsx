import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Brain,
  Code,
  Download,
  Settings,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  Users,
  Clock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import PromptOptimizationDemo from "@/components/prompt-organization-demo"

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
    { label: 'Prompts Optimized', value: '10,000+', icon: Sparkles },
    { label: 'Average Reduction', value: '60%', icon: TrendingUp },
    { label: 'Happy Users', value: '500+', icon: Users },
    { label: 'Uptime', value: '99.9%', icon: Clock }
  ]

  const features = [
    {
      title: '60% Token Reduction',
      description: 'Dramatically reduce API costs while maintaining output quality',
      icon: TrendingUp
    },
    {
      title: 'AI-Powered',
      description: 'Advanced algorithms understand context and preserve meaning',
      icon: Sparkles
    },
    {
      title: 'Universal Support',
      description: 'Works with GPT-4, Claude, Gemini, Grok, and more',
      icon: CheckCircle
    }
  ]

  /* ---------- demo data ---------- */
  const llmPrompts = {
    original: "Create a data model for a driver on a car-sharing platform",
    optimized: `<task>
Design a comprehensive data model for a driver entity in a car-sharing platform system.
</task>

<context>
Car-sharing platform where drivers register, get verified, and provide rides.
</context>

<requirements>
- Identification & auth
- Vehicle info & verification
- Ratings & reviews
- Payments & earnings
- Location / availability
- Compliance & safety
</requirements>

<output_format>
1. Core attributes
2. Vehicle fields
3. Platform-specific data
4. Relationships
5. Types & indexes
</output_format>

<techniques_applied>
Chain-of-Thought • Few-Shot • Role Prompting • Structured Output
</techniques_applied>`,
  }

  const algorithmPrompts = {
    original: "Create a data model for a driver on a car-sharing platform",
    optimized:
      "X bright cra▢ uminateписаw data model for a driver on a саreльlackstadenατă",
  }

  const run = type => {
    setIsOptimizing(p => ({ ...p, [type]: true }))
    setTimeout(() => {
      setIsOptimizing(p => ({ ...p, [type]: false }))
      setShowOptimized(p => ({ ...p, [type]: true }))
    }, 2500)
  }

  const copy = txt => navigator.clipboard.writeText(txt)

  const techniques = [
    "Chain-of-Thought",
    "Few-Shot",
    "Role Prompting",
    "XML Structuring",
    "Output Formatting",
    "Context Setting",
  ]

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Prompt Enhancement
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Optimize your<br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI prompts
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Reduce token usage by up to 60% while maintaining perfect clarity and meaning. 
              Works with GPT-4, Claude, Gemini, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                onClick={onGetStarted}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Two Optimization Methods */}
      {/* <PromptOptimizationDemo /> removed as demo is no longer a separate page */}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose Prompt Copilot?
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI optimization for all your prompting needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to optimize your prompts?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands saving 60% on AI costs while improving prompt quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3"
              onClick={onGetStarted}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3"
              onClick={() => window.location.href = '/demo'}
            >
              Try Demo
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <p className="text-purple-200 mt-4">
            No credit card required • Start optimizing immediately
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Prompt Copilot</h3>
              <p className="text-gray-400">
                Advanced prompt optimization for all your favorite LLMs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Download</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Chrome Extension</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 Prompt Copilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
