import { useState } from "react"
import { Brain, Settings, Sparkles, Code, Zap, Copy, Check } from "lucide-react"
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
import { useAuth } from "@/hooks/useAuth"

export default function PromptOptimizationDemo() {
  const [show, setShow] = useState({ llm: false, algo: false })
  const [busy, setBusy] = useState({ llm: false, algo: false })
  const [copied, setCopied] = useState({ llm: false, algo: false })
  const [results, setResults] = useState({ llm: null, algo: null })
  const [error, setError] = useState({ llm: null, algo: null })
  const { token } = useAuth()

  const samplePrompt = "Create a data model for a driver on a car-sharing platform"

  // Simple token counting (approximate)
  const countTokens = (text) => {
    return Math.ceil(text.split(/\s+/).length * 1.3) // Rough approximation
  }

  const run = async (kind) => {
    setBusy((s) => ({ ...s, [kind]: true }))
    setError((s) => ({ ...s, [kind]: null }))
    
    try {
      const response = await fetch('http://localhost:8002/api/prompts/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          prompt: samplePrompt,
          method: kind
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setResults((s) => ({ ...s, [kind]: data.enhanced_prompt }))
        setShow((s) => ({ ...s, [kind]: true }))
      } else {
        throw new Error(data.error || 'Enhancement failed')
      }
    } catch (err) {
      console.error(`Error in ${kind} enhancement:`, err)
      setError((s) => ({ ...s, [kind]: err.message }))
      // Fallback to demo data if API fails
      if (kind === 'llm') {
        setResults((s) => ({ ...s, [kind]: `<task>
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
</techniques_applied>` }))
      } else {
        setResults((s) => ({ ...s, [kind]: "Create driver data model for car-sharing platform" }))
      }
      setShow((s) => ({ ...s, [kind]: true }))
    } finally {
      setBusy((s) => ({ ...s, [kind]: false }))
    }
  }

  const copyToClipboard = async (text, kind) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied((s) => ({ ...s, [kind]: true }))
      setTimeout(() => setCopied((s) => ({ ...s, [kind]: false })), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const techniques = [
    "Chain-of-Thought",
    "Few-Shot",
    "Role Prompting",
    "XML Structuring",
    "Output Formatting",
    "Context Setting",
  ]

  /* cost maths for the compression banner */
  const originalTokens = countTokens(samplePrompt)
  const compressedTokens = results.algo ? countTokens(results.algo) : originalTokens
  const tokenReduction = (((originalTokens - compressedTokens) / originalTokens) * 100).toFixed(0)
  const costPerToken = 0.00002
  const savings = (originalTokens - compressedTokens) * costPerToken

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* ---------- HEADER ---------- */}
        <header className="text-center mb-16 space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
            Two Powerful Optimization Methods
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            See how our AI transforms your prompts using different approaches
          </p>
        </header>

        {/* ---------- TAB SELECTOR ---------- */}
        <Tabs defaultValue="llm" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="backdrop-blur-sm bg-slate-800/80 shadow-inner border border-slate-700/60 rounded-full inline-flex gap-1 p-1">
              <TabsTrigger
                value="llm"
                className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600/90 focus:outline-none"
              >
                <Settings className="h-4 w-4 group-data-[state=active]:animate-spin" />
                <span>LLM Enhancement</span>
              </TabsTrigger>

              <TabsTrigger
                value="algo"
                className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600/90 focus:outline-none"
              >
                <Brain className="h-4 w-4 group-data-[state=active]:animate-pulse" />
                <span>Algorithm Compression</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ---------- LLM ENHANCEMENT ---------- */}
          <TabsContent value="llm" className="space-y-12">
            <h3 className="text-center text-3xl font-bold">LLM Enhancement with Prompting Techniques</h3>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Original Prompt Card */}
              <Card className="bg-slate-900/90 border border-slate-700/60 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code className="h-5 w-5" /> Original Prompt
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Simple, basic prompt without structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-800/80 p-4 rounded-lg text-slate-200 whitespace-pre-wrap">
                    {samplePrompt}
                  </pre>
                </CardContent>
              </Card>

              {/* Enhanced Prompt Card */}
              <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-700/40 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="h-5 w-5" /> LLM Enhanced
                  </CardTitle>
                  <CardDescription className="text-blue-300">
                    Enhanced with XML structure and prompting techniques
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <AnimatePresence mode="wait">
                    {!show.llm ? (
                      <motion.div
                        key="apply-llm"
                        className="flex flex-col items-center justify-center h-80"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {error.llm && (
                          <div className="text-red-400 text-sm mb-4 text-center">
                            {error.llm}
                          </div>
                        )}
                        {/* badges */}
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                          {techniques.map((t, i) => (
                            <motion.span
                              key={t}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className="px-2 py-1 text-xs bg-blue-500/20 border border-blue-500/40 rounded text-blue-300"
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                        <Button
                          onClick={() => run("llm")}
                          disabled={busy.llm}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600/90 shadow-md"
                        >
                          {busy.llm ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              >
                                <Settings className="h-4 w-4 mr-2" />
                              </motion.div>
                              Enhancing…
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" /> Apply LLM Techniques
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="llm-out"
                        className="relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <pre className="bg-blue-900/30 border border-blue-700/50 p-4 rounded-lg text-blue-100 h-80 overflow-y-auto whitespace-pre-wrap shadow-inner">
                          {results.llm}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 text-blue-300 hover:text-blue-100"
                          onClick={() => copyToClipboard(results.llm, 'llm')}
                        >
                          {copied.llm ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------- ALGORITHM COMPRESSION ---------- */}
          <TabsContent value="algo" className="space-y-12">
            <h3 className="text-center text-3xl font-bold">Algorithm Compression</h3>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-slate-900/90 border border-slate-700/60 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code className="h-5 w-5" /> Original Prompt
                  </CardTitle>
                  <CardDescription className="text-slate-400">{originalTokens} tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-800/80 p-4 rounded-lg text-slate-200 whitespace-pre-wrap">
                    {samplePrompt}
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-700/40 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5" /> Compressed
                  </CardTitle>
                  {show.algo && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-purple-600 text-white/90">{tokenReduction}% reduction</Badge>
                      <Badge className="bg-green-600 text-white/90">${savings.toFixed(4)} saved</Badge>
                      <Badge className="bg-blue-600 text-white/90">{compressedTokens} tokens</Badge>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <AnimatePresence mode="wait">
                    {!show.algo ? (
                      <motion.div
                        key="apply-algo"
                        className="flex items-center justify-center h-80"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {error.algo && (
                          <div className="text-red-400 text-sm mb-4 text-center">
                            {error.algo}
                          </div>
                        )}
                        <Button
                          onClick={() => run("algo")}
                          disabled={busy.algo}
                          className="bg-gradient-to-r from-purple-600 to-pink-600/90 shadow-md"
                        >
                          {busy.algo ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              >
                                <Brain className="h-4 w-4 mr-2" />
                              </motion.div>
                              Compressing…
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" /> Run Algorithm
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="algo-out"
                        className="relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <pre className="bg-purple-900/30 border border-purple-700/50 p-4 rounded-lg text-purple-100 h-80 overflow-y-auto whitespace-pre-wrap shadow-inner">
                          {results.algo}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 text-purple-300 hover:text-purple-100"
                          onClick={() => copyToClipboard(results.algo, 'algo')}
                        >
                          {copied.algo ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
 