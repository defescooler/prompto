"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Section from "@/components/ui/section"
import AnimatedBlob from "@/components/ui/animated-blob"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Home, Zap } from "lucide-react"
import { tokens } from "@/lib/tokens"
import { cn } from "@/lib/utils"

export default function Animated404() {
  const navigate = useNavigate()
  const [glitchCount, setGlitchCount] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || (e.key === 'h' && e.metaKey)) {
        navigate('/')
      } else if (e.key === 'b' && e.metaKey) {
        navigate(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleGlitch = () => {
    setGlitchCount(prev => prev + 1)
  }

  return (
    <Section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <AnimatedBlob
        variant="circle"
        size={300}
        speed={0.5}
        opacity={5}
        className="top-20 left-20"
      />
      <AnimatedBlob
        variant="hex"
        size={200}
        speed={0.8}
        opacity={8}
        className="bottom-32 right-24"
      />
      <AnimatedBlob
        variant="square"
        size={120}
        speed={1.2}
        opacity={10}
        className="top-1/2 right-1/3"
      />

      <Card variant="glass" className="relative z-10 p-12 max-w-2xl mx-auto text-center space-y-8">
        {/* Glitch Counter Badge */}
        {glitchCount > 0 && (
          <Badge variant="secondary" className="absolute -top-2 -right-2">
            Glitch x{glitchCount}
          </Badge>
        )}

        {/* 404 Text */}
        <div className="space-y-4">
          <div
            className={cn(
              "text-8xl md:text-9xl font-black",
              tokens.colors.accent.primary,
              "tracking-tight cursor-pointer select-none",
              "transition-all duration-75",
              glitchCount > 0 && "animate-pulse"
            )}
            onClick={handleGlitch}
          >
            404
          </div>
          
          <div className="space-y-2">
            <h1 className={cn(tokens.typography.headline, tokens.colors.text.primary)}>
              Page Not Found
            </h1>
            <p className={cn(tokens.typography.body, tokens.colors.text.secondary, "max-w-md mx-auto")}>
              The page you're looking for doesn't exist or has been moved to another dimension.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="group"
          >
            <Home className={cn(tokens.icon.className, "mr-2 group-hover:scale-110 transition-transform")} />
            Go Home
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className={cn(tokens.icon.className, "mr-2")} />
            Go Back
          </Button>
        </div>

        {/* Easter Egg */}
        <div className="pt-4 border-t border-slate-700/30">
          <p className={cn(tokens.typography.body, tokens.colors.text.muted, "text-xs")}>
            Click the 404 to trigger glitch effects <Zap className="inline w-3 h-3 ml-1" />
          </p>
        </div>
      </Card>
    </Section>
  )
} 