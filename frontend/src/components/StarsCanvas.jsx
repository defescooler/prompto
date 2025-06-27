import { useEffect, useRef } from 'react'

const StarsCanvas = ({ particleCount = 150, speed = 0.5 }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let scrollY = 0
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Respect motion preferences - reduce particles and disable animation if needed
    const effectiveParticleCount = isReducedMotion ? Math.min(particleCount * 0.3, 30) : particleCount
    const effectiveSpeed = isReducedMotion ? 0 : speed

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles with parallax depth layers
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < effectiveParticleCount; i++) {
        // Create 3 depth layers for parallax effect
        const depth = Math.random() < 0.6 ? 0.3 : Math.random() < 0.8 ? 0.6 : 1.0
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * (1.2 * depth) + (0.4 * depth),
          alpha: Math.random() * (0.4 * depth) + (0.2 * depth),
          speedX: (Math.random() - 0.5) * effectiveSpeed * 0.3 * depth,
          speedY: (Math.random() - 0.5) * effectiveSpeed * 0.3 * depth,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: isReducedMotion ? 0 : Math.random() * 0.01 * depth + 0.005,
          depth: depth, // Store depth for parallax calculations
          parallaxFactor: depth * 0.5, // How much this particle moves with scroll
        })
      }
    }

    // Handle scroll for enhanced parallax effect
    const handleScroll = () => {
      scrollY = window.scrollY
    }

    // Animation loop with parallax layers
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Only animate if motion is allowed
        if (!isReducedMotion) {
          // Update particle position with depth-based movement
          particle.x += particle.speedX * particle.depth
          particle.y += particle.speedY * particle.depth + scrollY * 0.00003 * particle.depth

          // Wrap particles around screen
          if (particle.x < 0) particle.x = canvas.width
          if (particle.x > canvas.width) particle.x = 0
          if (particle.y < -10) particle.y = canvas.height + 10
          if (particle.y > canvas.height + 10) particle.y = -10

          // Update twinkle animation
          particle.twinkle += particle.twinkleSpeed
        }

        // Enhanced parallax offset based on depth
        const twinkleAlpha = isReducedMotion ? 1 : Math.sin(particle.twinkle) * 0.2 + 0.8
        const parallaxOffset = isReducedMotion ? 0 : scrollY * particle.parallaxFactor * 0.0002

        // Draw particle with depth-based styling
        ctx.save()
        ctx.globalAlpha = particle.alpha * twinkleAlpha
        
        // Color varies by depth - deeper particles are more blue/white, closer ones more green
        const colorMix = particle.depth
        if (colorMix > 0.8) {
          ctx.fillStyle = 'rgba(255, 255, 255, 1)' // Foreground - bright white
        } else if (colorMix > 0.5) {
          ctx.fillStyle = 'rgba(200, 255, 220, 1)' // Mid-ground - slight green tint
        } else {
          ctx.fillStyle = 'rgba(150, 200, 255, 1)' // Background - blue tint
        }
        
        // Add subtle glow for larger particles (reduced for performance)
        if (particle.radius > 0.8 && !isReducedMotion && particle.depth > 0.6) {
          ctx.shadowColor = particle.depth > 0.8 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 150, 255, 0.15)'
          ctx.shadowBlur = particle.radius * 1.5 * particle.depth
        }

        ctx.beginPath()
        ctx.arc(
          particle.x,
          particle.y + parallaxOffset,
          particle.radius,
          0,
          Math.PI * 2
        )
        ctx.fill()
        ctx.restore()

        // Add occasional special particles (shooting stars) for foreground layer
        if (index % 25 === 0 && !isReducedMotion && particle.depth > 0.8) {
          ctx.save()
          ctx.globalAlpha = particle.alpha * twinkleAlpha * 0.3
          ctx.fillStyle = 'rgba(34, 197, 94, 1)'
          
          // Small trailing effect for shooting stars
          ctx.shadowColor = 'rgba(34, 197, 94, 0.4)'
          ctx.shadowBlur = particle.radius * 3
          
          ctx.beginPath()
          ctx.arc(
            particle.x - particle.speedX * 10,
            particle.y + parallaxOffset - particle.speedY * 10,
            particle.radius * 0.4,
            0,
            Math.PI * 2
          )
          ctx.fill()
          ctx.restore()
        }
      })

      // Only continue animation if motion is allowed
      if (!isReducedMotion || effectiveParticleCount > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Listen for motion preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = (e) => {
      isReducedMotion = e.matches
      if (isReducedMotion && animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        // Redraw static particles
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        particlesRef.current.forEach(particle => {
          ctx.save()
          ctx.globalAlpha = particle.alpha
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
      } else if (!isReducedMotion) {
        animate()
      }
    }

    motionMediaQuery.addListener(handleMotionChange)

    // Initialize
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('scroll', handleScroll, { passive: true })
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('scroll', handleScroll)
      motionMediaQuery.removeListener(handleMotionChange)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, speed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
      aria-hidden="true"
    />
  )
}

export default StarsCanvas 