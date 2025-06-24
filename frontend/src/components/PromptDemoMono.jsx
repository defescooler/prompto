import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Code, Sparkles, Settings, Brain, Copy } from "lucide-react"

export default function PromptDemoMono() {
  const [activeTab, setActiveTab] = useState("llm")
  const [showResult, setShowResult] = useState({ llm: false, algo: false })
  const [isProcessing, setIsProcessing] = useState({ llm: false, algo: false })

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

  const algoCompressed = "X bright cra▢ uminateписаw data model for a driver on a саreьlackstadenατă"

  const llmTechniques = [
    "Chain-of-Thought",
    "Few-Shot Learning", 
    "Role Prompting",
    "XML Structuring",
    "Output Formatting",
    "Context Setting"
  ]

  const runProcess = (type) => {
    setIsProcessing(prev => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setIsProcessing(prev => ({ ...prev, [type]: false }))
      setShowResult(prev => ({ ...prev, [type]: true }))
    }, 2500)
  }

  return (
    <section className="w-full py-20 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Two Powerful Optimization Methods
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            See how our AI transforms your prompts using different approaches
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700 gap-2">
            <button
              onClick={() => setActiveTab("llm")}
              className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
                activeTab === "llm" 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings size={20} />
              LLM Enhancement
            </button>
            <button
              onClick={() => setActiveTab("algo")}
              className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
                activeTab === "algo" 
                  ? "bg-purple-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Brain size={20} />
              Token Optimization
            </button>
          </div>
        </div>

        {/* LLM Enhancement Tab */}
        {activeTab === "llm" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                LLM Enhancement with Prompting Techniques
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Transform simple prompts using XML structure, chain-of-thought, role prompting, and other advanced techniques
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Original Prompt */}
              <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code size={20} />
                    Original Prompt
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Simple, basic prompt without structure</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 border border-slate-300">
                    <code className="text-black text-sm font-medium">{originalPrompt}</code>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">12 tokens</span>
                  </div>
                </CardContent>
              </Card>

              {/* LLM Enhanced */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings size={20} />
                    LLM Enhanced
                  </CardTitle>
                  <p className="text-blue-300 text-sm">Enhanced with XML structure and prompting techniques</p>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                  {!showResult.llm ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                      {/* Technique Badges */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {llmTechniques.map((technique, i) => (
                          <motion.div
                            key={technique}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-center"
                          >
                            <span className="text-xs text-black font-medium">{technique}</span>
                          </motion.div>
                        ))}
                      </div>

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
                            Apply LLM Techniques
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30 max-h-80 overflow-y-auto">
                        <div className="bg-white rounded-lg p-4 border border-slate-300 max-h-80 overflow-y-auto">
                          <pre className="text-black text-xs whitespace-pre-wrap font-medium">{llmEnhanced}</pre>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
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

        {/* Algorithm Compression Tab */}
        {activeTab === "algo" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Token Optimization
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Compress prompts while preserving essential information using advanced semantic analysis
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Original Prompt */}
              <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code size={20} />
                    Original Prompt
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Simple, basic prompt</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 border border-slate-300">
                    <code className="text-black text-sm font-medium">{originalPrompt}</code>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">12 tokens</span>
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Compressed */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain size={20} />
                    Token Optimized
                  </CardTitle>
                  <p className="text-purple-300 text-sm">Compressed while preserving meaning</p>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                  {!showResult.algo ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Button
                        onClick={() => runProcess("algo")}
                        disabled={isProcessing.algo}
                        className="!bg-green-500 hover:!bg-green-700 disabled:!bg-green-500 !text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200"
                        style={{ 
                          backgroundColor: '#10b981 !important',
                          borderColor: '#10b981 !important',
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
                            Compressing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} className="mr-2" />
                            Run Optimization
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-white rounded-lg p-4 border border-slate-300">
                        <code className="text-black text-sm font-medium">{algoCompressed}</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">🔖 12 → 8 tokens (33% saved)</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigator.clipboard.writeText(algoCompressed)}
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

            {/* Results Banner */}
            {showResult.algo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Token Optimization Results</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">33%</div>
                    <div className="text-sm text-slate-300 font-medium mb-1">Token Reduction</div>
                    <div className="text-xs text-slate-500">Significant compression achieved</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
                    <div className="text-sm text-slate-300 font-medium mb-1">Information Preserved</div>
                    <div className="text-xs text-slate-500">All essential details maintained</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">$0.45</div>
                    <div className="text-sm text-slate-300 font-medium mb-1">Cost Savings</div>
                    <div className="text-xs text-slate-500">Per 1K API calls</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
} 