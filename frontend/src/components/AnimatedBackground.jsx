import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AnimatedBackground({ 
  className, 
  children, 
  shapes = "circles", 
  speed = 1, 
  variant = "blend",
  disable = false 
}) {
  const ref = useRef(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [batteryLow, setBatteryLow] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  // Check for prefers-reduced-motion and mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 768px)')
    
    setPrefersReducedMotion(mediaQuery.matches)
    setIsMobile(mobileQuery.matches)
    
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches)
    const handleMobileChange = (e) => setIsMobile(e.matches)
    
    mediaQuery.addEventListener('change', handleMotionChange)
    mobileQuery.addEventListener('change', handleMobileChange)
    
    // Check for battery API and save data
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLow(battery.level < 0.2)
        battery.addEventListener('levelchange', () => {
          setBatteryLow(battery.level < 0.2)
        })
      })
    }
    
    // Check for data saver
    if ('connection' in navigator && navigator.connection?.saveData) {
      setPrefersReducedMotion(true)
    }
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      mobileQuery.removeEventListener('change', handleMobileChange)
    }
  }, [])

  // Smooth spring so shapes glide instead of jumping
  const prog = useSpring(scrollYProgress, { 
    stiffness: isMobile ? 40 : 60, 
    damping: isMobile ? 30 : 20,
    ease: [0.32, 0.72, 0, 1]
  })

  // Reduce motion intensity on mobile and low battery
  const motionMultiplier = (isMobile || batteryLow) ? 0.5 : 1
  const speedAdjusted = speed * motionMultiplier

  // Map scroll → transforms (scale by speed prop)
  const y = useTransform(prog, [0, 1], [`${-15 * speedAdjusted}%`, `${15 * speedAdjusted}%`])
  const rotate = useTransform(prog, [0, 1], ["0deg", `${25 * speedAdjusted}deg`])
  const scale = useTransform(prog, [0, 1], [0.8, 1.2 + (0.2 * speedAdjusted)])

  // Skip animation if disabled, reduced motion preferred, or performance constraints
  if (disable || prefersReducedMotion || (isMobile && batteryLow)) {
    return (
      <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  const getOpacity = () => {
    switch (variant) {
      case "light": return "opacity-[0.12]"
      case "dark": return "opacity-[0.08]"
      default: return "opacity-[0.10]" // blend
    }
  }

  const getSecondaryOpacity = () => {
    switch (variant) {
      case "light": return "opacity-[0.08]"
      case "dark": return "opacity-[0.06]"
      default: return "opacity-[0.07]"
    }
  }

  const renderShapes = () => {
    // Simplify shapes on mobile for better performance
    const simplifiedShapes = isMobile && shapes !== "circles" ? "circles" : shapes
    
    switch (simplifiedShapes) {
      case "rects":
        return (
          <>
            {/* Primary animated rectangle */}
            <motion.svg
              aria-hidden
              className={`pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] ${getOpacity()}`}
              style={{ y, rotate, scale }}
              viewBox="0 0 320 320"
              fill="none"
              animate={{
                x: [-20, 20, -20],
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.rect 
                x="60" y="60" width="200" height="200" rx="20" 
                fill="url(#rectGrad1)"
                animate={{
                  rx: [20, 40, 20],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <defs>
                <linearGradient id="rectGrad1" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="0.5" stopColor="#06b6d4" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </motion.svg>

            {!isMobile && (
              <motion.svg
                aria-hidden
                className={`pointer-events-none absolute right-[-180px] bottom-[-120px] h-[380px] w-[380px] ${getSecondaryOpacity()}`}
                style={{ y: useTransform(y, v => `calc(${v} * -0.6)`), scale }}
                viewBox="0 0 400 400"
                fill="none"
                animate={{
                  x: [10, -10, 10],
                  y: [15, -15, 15],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.rect
                  x="100" y="100" width="200" height="200" rx="40"
                  fill="url(#rectGrad2)"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                    rx: [40, 60, 40]
                  }}
                  transition={{ 
                    rotate: { repeat: Infinity, duration: 30, ease: "linear" },
                    scale: { repeat: Infinity, duration: 12, ease: "easeInOut" },
                    rx: { repeat: Infinity, duration: 15, ease: "easeInOut" }
                  }}
                />
                <defs>
                  <radialGradient id="rectGrad2" cx="0.5" cy="0.5" r="0.5">
                    <stop stopColor="#ec4899"/>
                    <stop offset="0.5" stopColor="#8b5cf6"/>
                    <stop offset="1" stopColor="#10b981"/>
                  </radialGradient>
                </defs>
              </motion.svg>
            )}
          </>
        )

      case "triangles":
        return (
          <>
            {/* Primary animated triangle */}
            <motion.svg
              aria-hidden
              className={`pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] ${getOpacity()}`}
              style={{ y, rotate, scale }}
              viewBox="0 0 320 320"
              fill="none"
              animate={{
                x: [-15, 15, -15],
                y: [-20, 20, -20],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.polygon 
                points="160,40 280,280 40,280" 
                fill="url(#triGrad1)"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <defs>
                <linearGradient id="triGrad1" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </motion.svg>

            {!isMobile && (
              <motion.svg
                aria-hidden
                className={`pointer-events-none absolute right-[-180px] bottom-[-120px] h-[380px] w-[380px] ${getSecondaryOpacity()}`}
                style={{ y: useTransform(y, v => `calc(${v} * -0.6)`), scale }}
                viewBox="0 0 400 400"
                fill="none"
                animate={{
                  x: [20, -20, 20],
                  y: [10, -10, 10],
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.polygon
                  points="200,50 350,350 50,350"
                  fill="url(#triGrad2)"
                  animate={{ 
                    rotate: [0, -360],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    rotate: { repeat: Infinity, duration: 40, ease: "linear" },
                    scale: { repeat: Infinity, duration: 14, ease: "easeInOut" }
                  }}
                />
                <defs>
                  <linearGradient id="triGrad2" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ec4899"/>
                    <stop offset="0.5" stopColor="#8b5cf6"/>
                    <stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </motion.svg>
            )}
          </>
        )

      default: // circles
        return (
          <>
            {/* Primary animated circle */}
            <motion.svg
              aria-hidden
              className={`pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] ${getOpacity()}`}
              style={{ y, rotate, scale }}
              viewBox="0 0 320 320"
              fill="none"
              animate={{
                x: [-25, 25, -25],
                y: [-15, 15, -15],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.circle 
                cx="160" cy="160" r="140" 
                fill="url(#grad1)"
                animate={{
                  r: [140, 160, 140],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <defs>
                <radialGradient id="grad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(160 160) rotate(90) scale(160)">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#06b6d4" />
                </radialGradient>
              </defs>
            </motion.svg>

            {!isMobile && (
              <motion.svg
                aria-hidden
                className={`pointer-events-none absolute right-[-180px] bottom-[-120px] h-[380px] w-[380px] ${getSecondaryOpacity()}`}
                style={{ y: useTransform(y, v => `calc(${v} * -0.6)`), scale }}
                viewBox="0 0 600 600"
                fill="none"
                animate={{
                  x: [30, -30, 30],
                  y: [20, -20, 20],
                }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.path
                  d="M300 37C349-7 429-7 478 37c49 43 78 128 78 227s-29 184-78 227c-49 44-129 44-178 0C221 448 192 363 192 264S251 80 300 37Z"
                  fill="url(#grad2)"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    rotate: { repeat: Infinity, duration: 35, ease: "linear" },
                    scale: { repeat: Infinity, duration: 18, ease: "easeInOut" },
                    opacity: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                  }}
                />
                <defs>
                  <linearGradient id="grad2" x1="0" x2="600" y1="0" y2="600"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ec4899"/>
                    <stop offset="0.5" stopColor="#8b5cf6"/>
                    <stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </motion.svg>
            )}
          </>
        )
    }
  }

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      {renderShapes()}
      {/* Actual content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
} 