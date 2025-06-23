import { useEffect } from "react"
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Users,
  Clock,
  Github,
  Twitter,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Footer from "@/components/ui/footer"

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
      {/* <PromptOptimizationDemo /> removed as demo is no longer a separate page */}

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why choose Prompt Copilot?
            </h2>
            <p className="text-xl text-slate-300">
              Advanced AI optimization for all your prompting needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-6 hover:-translate-y-1 hover:shadow-xl transition">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-200" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section (shares dark bg) */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center mt-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[linear-gradient(120deg,#18181b_0%,#312e81_100%)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to optimize your prompts?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands saving 60% on AI costs while improving prompt quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          <p className="text-slate-400 mt-4">
            No credit card required • Start optimizing immediately
          </p>
        </div>
      </section>

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
