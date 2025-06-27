import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Terminal, Sparkles, Copy, CheckCircle, Settings, Zap, Code, ChevronRight } from 'lucide-react'

const TerminalOutput = ({ content, isEnhanced = false, onCopy, copiedRecently = false }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (content && isEnhanced) {
      setIsTyping(true)
      setDisplayedContent('')
      
      let index = 0
      let animationId
      let lastTime = 0
      const typeDelay = 16 // 60fps for smoother animation
      
      const typeCharacter = (currentTime) => {
        if (currentTime - lastTime >= typeDelay) {
          if (index < content.length) {
            setDisplayedContent(content.slice(0, index + 1))
            index++
            lastTime = currentTime
          } else {
            setIsTyping(false)
            return
          }
        }
        animationId = requestAnimationFrame(typeCharacter)
      }

      animationId = requestAnimationFrame(typeCharacter)
      return () => cancelAnimationFrame(animationId)
    } else {
      setDisplayedContent(content)
      setIsTyping(false)
    }
  }, [content, isEnhanced])

  if (!content) return null

  return (
    <div className="mt-4 relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#22c55e]/20 via-[#22c55e]/10 to-[#22c55e]/20 rounded-xl blur opacity-50"></div>
      <div className="relative bg-[#0a0f0a] border border-[#22c55e]/30 rounded-xl font-mono text-sm overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#22c55e]/20">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-[#64748b] text-xs font-medium">prompto-terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#22c55e]/10 text-[#22c55e] text-xs border-[#22c55e]/20 font-mono rounded-full">
              ENHANCED
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-[#22c55e] hover:text-white hover:bg-[#22c55e]/10 p-1 h-6 w-6"
              onClick={() => onCopy(content)}
            >
              {copiedRecently ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-[#64748b] text-sm mb-3">
            <Terminal className="w-4 h-4" />
            <span className="text-[#22c55e]">prompto@terminal</span>
            <span>:</span>
            <span className="text-blue-400">~/enhance</span>
            <span className="text-white">$</span>
            <span className="text-[#22c55e]">process --model=gemini-pro</span>
          </div>
          
          <div className="relative">
            <div className="text-[#22c55e] leading-relaxed whitespace-pre-wrap">
              {displayedContent}
              {isTyping && (
                <span className="inline-block w-2 h-5 bg-[#22c55e] ml-1 animate-pulse"></span>
              )}
            </div>
            
            {!isTyping && isEnhanced && (
              <div className="flex items-center gap-2 mt-3 text-xs text-[#64748b]">
                <Zap className="w-3 h-3 text-[#22c55e]" />
                <span>Enhancement complete • {content.length} chars</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PromptTerminal({ 
  onPromptEnhanced
}) {
  const [prompt, setPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('gemini-pro')
  const [quickFormat, setQuickFormat] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [copiedRecently, setCopiedRecently] = useState(false)

  // Listen for re-use prompt events
  useEffect(() => {
    const handleReusePrompt = (event) => {
      setPrompt(event.detail)
    }
    window.addEventListener('reusePrompt', handleReusePrompt)
    return () => window.removeEventListener('reusePrompt', handleReusePrompt)
  }, [])

  // Memoized constants for better performance
  const models = useMemo(() => [
    { value: 'gemini-pro', label: 'Gemini Pro', icon: '🧠' },
    { value: 'gpt-4', label: 'GPT-4', icon: '🤖' },
    { value: 'claude-3', label: 'Claude 3', icon: '⚡' }
  ], [])

  const quickFormats = useMemo(() => [
    { value: '', label: 'Choose format...' },
    { value: 'story', label: '📖 Story', template: 'Write a compelling story about: ' },
    { value: 'email', label: '📧 Email', template: 'Write a professional email about: ' },
    { value: 'summary', label: '📝 Summary', template: 'Summarize the following in 3 key points: ' },
    { value: 'code', label: '💻 Code', template: 'Write clean, well-documented code to: ' }
  ], [])

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return
    
    setIsEnhancing(true)
    try {
      const token = localStorage.getItem('token')
      const API_BASE_URL = 'http://localhost:8002'
      
      const response = await fetch(`${API_BASE_URL}/api/prompts/enhance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          provider: selectedModel === 'gpt-4' ? 'openai' : selectedModel === 'gemini-pro' ? 'gemini' : 'auto',
          method: 'llm'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setEnhancedPrompt(data.enhanced_prompt)
        onPromptEnhanced?.()
      } else {
        const errorData = await response.json()
        console.error('Enhancement failed:', errorData.error)
        setEnhancedPrompt(`Error: ${errorData.error || 'Failed to enhance prompt'}`)
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
      setEnhancedPrompt('Error: Network connection failed. Please check if the backend is running.')
    } finally {
      setIsEnhancing(false)
    }
  }, [prompt, selectedModel, onPromptEnhanced])

  const handleCopy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedRecently(true)
      setTimeout(() => setCopiedRecently(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const handleQuickFormat = useCallback((format) => {
    const template = quickFormats.find(f => f.value === format)?.template
    if (template && !prompt.startsWith(template)) {
      setPrompt(template + prompt)
    }
    setQuickFormat('')
  }, [quickFormats, prompt])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <Card className="bg-[#1e293b] border border-[#334155] rounded-xl shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Terminal className="w-5 h-5 text-[#22c55e]" />
            Prompt Terminal
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[#64748b] hover:text-[#22c55e] p-1"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#94a3b8]">Quick Format:</span>
            <Select value={quickFormat} onValueChange={handleQuickFormat}>
              <SelectTrigger className="w-48 bg-[#0f172a] border-[#334155] text-white rounded-lg">
                <SelectValue placeholder="Choose format..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                {quickFormats.slice(1).map((format) => (
                  <SelectItem key={format.value} value={format.value} className="text-white">
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {showAdvanced && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#94a3b8]">Model:</span>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-40 bg-[#0f172a] border-[#334155] text-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#334155]">
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value} className="text-white">
                      <span className="flex items-center gap-2">
                        <span>{model.icon}</span>
                        <span>{model.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input Area */}
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[#64748b] text-sm pointer-events-none z-10">
            <ChevronRight className="w-4 h-4" />
            <span className="font-mono">$</span>
          </div>
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] bg-[#0a0f0a] border border-[#334155] text-white placeholder:text-[#64748b] font-mono pl-12 pt-3 resize-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] shadow-inner rounded-xl"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#64748b] font-mono">
            <span className="text-[#22c55e]">Tip:</span> Press <kbd className="px-2 py-1 bg-[#0f172a] border border-[#334155] rounded-lg text-xs">⌘</kbd> + <kbd className="px-2 py-1 bg-[#0f172a] border border-[#334155] rounded-lg text-xs">Enter</kbd> to enhance
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isEnhancing || !prompt.trim()} 
            className="bg-[#22c55e] text-black hover:bg-[#16a34a] font-semibold relative overflow-hidden group min-w-[140px] rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {isEnhancing ? (
              <div className="flex items-center">
                <Terminal className="w-4 h-4 mr-2 animate-pulse" /> 
                <span className="animate-pulse">Processing</span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-1 bg-black rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> 
                Execute
              </>
            )}
          </Button>
        </div>

        {/* Enhanced Output */}
        <TerminalOutput 
          content={enhancedPrompt}
          isEnhanced={!!enhancedPrompt}
          onCopy={handleCopy}
          copiedRecently={copiedRecently}
        />
      </CardContent>
    </Card>
  )
} 