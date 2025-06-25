import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Code, Sparkles, Settings, Brain, Copy } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function PromptDemoMono() {
  const [activeTab, setActiveTab] = useState("llm")
  const [showResult, setShowResult] = useState({ llm: false, algo: false })
  const [isProcessing, setIsProcessing] = useState({ llm: false, algo: false })
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)

  const originalPrompt = "Create a data model for a driver on a car-sharing platform"
  
  const llmEnhanced = `<task>
Design a comprehensive data model for a driver entity in a car-sharing platform system.
</task>

<context>
Car-sharing platform where drivers register, get verified, and provide rides to passengers.
</context>

<requirements>
- Driver identification and authentication
- Vehicle information and verification
- Rating and review system
- Payment and earnings tracking
- Location and availability status
- Compliance and safety records
</requirements>

<output_format>
Provide the data model in the following structure:
1. Core driver attributes (personal info, contact, documents)
2. Vehicle-related fields (car details, insurance, registration)
3. Platform-specific data (ratings, earnings, status)
4. Relationships with other entities (trips, passengers, payments)
5. Include data types, constraints, and indexes
</output_format>

<techniques_applied>
- Chain-of-Thought: Break down the model into logical components
- Few-Shot: Reference similar ride-sharing platforms (Uber, Lyft)
- Role Prompting: Act as a senior database architect
- Structured Output: Use clear sections and formatting
</techniques_applied>

Generate a complete database schema with explanations for each field choice.`

  const algoCompressed = "Create data model: driver entity for car-sharing platform"

  // Token optimization data
  const originalTokens = 12
  const optimizedTokens = 8
  const tokenSavings = originalTokens - optimizedTokens
  const tokenSavingsPercent = Math.round((tokenSavings / originalTokens) * 100)
  const costPerToken = 0.00002
  const savingsCost = (tokenSavings * costPerToken).toFixed(5)

  const llmTechniques = [
    "Chain-of-Thought",
    "Few-Shot Learning", 
    "Role Prompting",
    "XML Structuring",
    "Output Formatting",
    "Context Setting"
  ]

  const techniqueTooltips = {
    "Chain-of-Thought": "Encourages reasoning step by step",
    "Few-Shot Learning": "Provides examples for guidance",
    "Role Prompting": "Defines a role for the AI to assume",
    "XML Structuring": "Wraps input in XML schema to control response style",
    "Output Formatting": "Specifies how the output should be formatted",
    "Context Setting": "Provides contextual information to improve relevance",
  }

  const runProcess = (type) => {
    setIsProcessing(prev => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setIsProcessing(prev => ({ ...prev, [type]: false }))
      setShowResult(prev => ({ ...prev, [type]: true }))
    }, 2500)
  }

  const handleCompress = async () => {
    setIsCompressing(true);
    // Simulate compression progress
    const interval = setInterval(() => {
      setCompressionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompressing(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
    
    // Actual compression logic here
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="w-full py-36 px-6 sm:px-10 md:px-14 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase text-slate-400 mb-1">Prompt Copilot AI v2</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Two Powerful Optimization Methods
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            See how our AI transforms your prompts using different approaches
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-slate-900/50 rounded-xl p-2 border border-slate-700 gap-6 shadow-md">
            <button
              onClick={() => setActiveTab("llm")}
              className={`px-6 py-3 rounded-md flex items-center gap-4 transition-all ${
                activeTab === "llm" 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings size={20} />
              Make It Smarter
            </button>
            <button
              onClick={() => setActiveTab("algo")}
              className={`px-6 py-3 rounded-md flex items-center gap-4 transition-all ${
                activeTab === "algo" 
                  ? "bg-purple-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Brain size={20} />
              Make It Cheaper
            </button>
          </div>
        </div>

        {/* LLM Enhancement Tab */}
        {activeTab === "llm" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Prompt Reinvented
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Wrap your prompt in structured thinking. We add examples, context, and roles — so the model gets it right the first time.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-start">
              {/* Original Prompt */}
              <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="flex items-center gap-4 text-white mb-2">
                    <Code size={20} />
                    Original Prompt
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Simple, basic prompt without structure</p>
                </CardHeader>
                <CardContent className="min-h-[400px] py-6 px-6 space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-slate-300">
                    <code className="text-black text-sm font-medium">{originalPrompt}</code>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-500">12 tokens</span>
                  </div>
                </CardContent>
              </Card>

              {/* LLM Enhanced */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/40">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="flex items-center gap-4 text-white mb-2">
                    <Settings size={20} />
                    LLM Enhanced
                  </CardTitle>
                  <p className="text-blue-300 text-sm">Rewritten using 6+ proven AI tricks</p>
                </CardHeader>
                <CardContent className="min-h-[400px] py-6 px-6 space-y-6">
                  {!showResult.llm ? (
                    <div className="flex flex-col items-center justify-start h-full space-y-10">
                      {/* Technique Badges */}
                      <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
                        {llmTechniques.map((technique, i) => (
                          <motion.div
                            key={technique}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-center hover:bg-blue-500/30 transition-colors"
                          >
                            <span className="text-xs text-blue-300 font-medium">{technique}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* More Techniques Banner */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mb-4"
                      >
                        <span className="text-xs text-slate-500 font-medium">+21 more techniques</span>
                      </motion.div>

                      <Button
                        onClick={() => runProcess("llm")}
                        disabled={isProcessing.llm}
                        className="!bg-green-500 hover:!bg-green-700 disabled:!bg-green-500 !text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200"
                        style={{ 
                          backgroundColor: '#10b981 !important',
                          borderColor: '#10b981 !important',
                          color: '#ffffff !important'
                        }}
                      >
                        {isProcessing.llm ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Settings size={18} />
                            </motion.div>
                            Applying LLM Techniques...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} className="mr-2" />
                            Enhance Prompt
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30 max-h-80 overflow-y-auto">
                        <div className="bg-white rounded-lg p-4 border border-slate-300 max-h-80 overflow-y-auto">
                          <pre className="text-black text-xs whitespace-pre-wrap font-medium">{llmEnhanced}</pre>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                            <span className="text-xs font-medium text-blue-300">✨ Enhanced</span>
                          </div>
                          <span className="text-xs text-slate-400">More detailed & structured</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigator.clipboard.writeText(llmEnhanced)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Copy size={14} className="mr-1" />
                          Copy
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Token Optimization Section */}
        {activeTab === "algo" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Prompt, Shrunk
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                We cut out filler, not meaning. Get the same result with fewer tokens.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-start">
              {/* Original Prompt */}
              <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="flex items-center gap-4 text-white mb-2">
                    <Code size={20} />
                    Original Prompt
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Simple, basic prompt without optimization</p>
                </CardHeader>
                <CardContent className="min-h-[400px] py-6 px-6 space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-slate-300">
                    <code className="text-black text-sm font-medium">{originalPrompt}</code>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{originalTokens} tokens</span>
                  </div>
                </CardContent>
              </Card>

              {/* Token Optimized */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/40">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="flex items-center gap-4 text-white mb-2">
                    <Brain size={20} />
                    Token Optimized
                  </CardTitle>
                  <p className="text-purple-300 text-sm">Compressed to the bone — still crystal clear</p>
                </CardHeader>
                <CardContent className="min-h-[400px] py-6 px-6 space-y-6">
                  {!showResult.algo ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-10">
                      <Button
                        onClick={() => runProcess("algo")}
                        disabled={isProcessing.algo}
                        className="!bg-purple-500 hover:!bg-purple-700 disabled:!bg-purple-500 !text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200"
                        style={{ 
                          backgroundColor: '#a855f7 !important',
                          borderColor: '#a855f7 !important',
                          color: '#ffffff !important'
                        }}
                      >
                        {isProcessing.algo ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Brain size={18} />
                            </motion.div>
                            Compressing Tokens...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} className="mr-2" />
                            Run Compression
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30 max-h-80 overflow-y-auto">
                        <div className="bg-white rounded-lg p-4 border border-slate-300 max-h-80 overflow-y-auto">
                          <pre className="text-black text-xs whitespace-pre-wrap font-medium">{algoCompressed}</pre>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-center mt-6 gap-2">
                        <span className="text-xs text-slate-400">🔥 {tokenSavingsPercent}% shorter 💸 ${savingsCost} saved 🧮 {originalTokens} → {optimizedTokens} tokens</span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
} 