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

  // Smooth spring so shapes glide instead of jumping (using consistent easing)
  const prog = useSpring(scrollYProgress, { 
    stiffness: isMobile ? 40 : 60, 
    damping: isMobile ? 30 : 20,
    ease: [0.32, 0.72, 0, 1] // Consistent with design tokens
  })

  // Reduce motion intensity on mobile and low battery
  const motionMultiplier = (isMobile || batteryLow) ? 0.5 : 1
  const speedAdjusted = speed * motionMultiplier

  // Map scroll → transforms (scale by speed prop)
  const y = useTransform(prog, [0, 1], [`${-10 * speedAdjusted}%`, `${10 * speedAdjusted}%`])
  const rotate = useTransform(prog, [0, 1], ["0deg", `${15 * speedAdjusted}deg`])
  const scale = useTransform(prog, [0, 1], [1, 1 + (0.15 * speedAdjusted)])

  // Skip animation if disabled, reduced motion preferred, or performance constraints
  if (disable || prefersReducedMotion || (isMobile && batteryLow)) {
    return (
      <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  const getOpacity = () => {
    const baseOpacity = isMobile ? 0.5 : 1 // Reduce opacity on mobile
    switch (variant) {
      case "light": return `opacity-${Math.round(15 * baseOpacity)} dark:opacity-${Math.round(8 * baseOpacity)}`
      case "dark": return `opacity-${Math.round(8 * baseOpacity)} dark:opacity-${Math.round(15 * baseOpacity)}`
      default: return `opacity-${Math.round(20 * baseOpacity)} dark:opacity-${Math.round(10 * baseOpacity)}`
    }
  }

  const getSecondaryOpacity = () => {
    const baseOpacity = isMobile ? 0.3 : 1 // Further reduce secondary opacity on mobile
    switch (variant) {
      case "light": return `opacity-${Math.round(10 * baseOpacity)} dark:opacity-${Math.round(5 * baseOpacity)}`
      case "dark": return `opacity-${Math.round(5 * baseOpacity)} dark:opacity-${Math.round(10 * baseOpacity)}`
      default: return "opacity-[0.07] dark:opacity-[0.05]"
    }
  }

  const renderShapes = () => {
    // Simplify shapes on mobile for better performance
    const simplifiedShapes = isMobile && shapes !== "circles" ? "circles" : shapes
    
    switch (simplifiedShapes) {
      case "rects":
        return (
          <>
            {/* Back-layer rectangles */}
            <motion.svg
              aria-hidden
              className={`pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] ${getOpacity()}`}
              style={{ y, rotate, scale }}
              viewBox="0 0 320 320"
              fill="none"
            >
              <rect x="60" y="60" width="200" height="200" rx="20" fill="url(#rectGrad1)" />
              <defs>
                <linearGradient id="rectGrad1" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="0.5" stopColor="#06b6d4" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </motion.svg>

            {!isMobile && ( // Skip secondary shape on mobile
              <motion.svg
                aria-hidden
                className={`pointer-events-none absolute right-[-180px] bottom-[-120px] h-[380px] w-[380px] ${getSecondaryOpacity()}`}
                style={{ y: useTransform(y, v => `calc(${v} * -0.6)`), scale }}
                viewBox="0 0 400 400"
                fill="none"
              >
                <motion.rect
                  x="100" y="100" width="200" height="200" rx="40"
                  fill="url(#rectGrad2)"
                  animate={{ 
                    rotate: [0, 360],
                    transition: { repeat: Infinity, duration: 80, ease: "linear" }
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
            {/* Back-layer triangles */}
            <motion.svg
              aria-hidden
              className={`pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] ${getOpacity()}`}
              style={{ y, rotate, scale }}
              viewBox="0 0 320 320"
              fill="none"
            >
              <polygon points="160,40 280,280 40,280" fill="url(#triGrad1)" />
              <defs>
                <linearGradient id="triGrad1" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </motion.svg>

            {!isMobile && ( // Skip secondary shape on mobile
              <motion.svg
                aria-hidden
                className={`pointer-events-none absolute right-[-180px] bottom-[-120px] h-[380px] w-[380px] ${getSecondaryOpacity()}`}
                style={{ y: useTransform(y, v => `calc(${v} * -0.6)`), scale }}
                viewBox="0 0 400 400"
                fill="none"
              >
                <motion.polygon
                  points="200,50 350,350 50,350"
                  fill="url(#triGrad2)"
                  animate={{ 
                    rotate: [0, -360],
                    transition: { repeat: Infinity, duration: 100, ease: "linear" }
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
            {/* Back-layer shapes */}
            <motion.svg
              aria-hidden
              className={`pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] ${getOpacity()}`}
              style={{ y, rotate, scale }}
              viewBox="0 0 320 320"
              fill="none"
            >
              <circle cx="160" cy="160" r="140" fill="url(#grad1)" />
              <defs>
                <radialGradient id="grad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(160 160) rotate(90) scale(160)">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#06b6d4" />
                </radialGradient>
              </defs>
            </motion.svg>

            {!isMobile && ( // Skip complex blob on mobile
              <motion.svg
                aria-hidden
                className={`pointer-events-none absolute right-[-180px] bottom-[-120px] h-[380px] w-[380px] ${getSecondaryOpacity()}`}
                style={{ y: useTransform(y, v => `calc(${v} * -0.6)`), scale }}
                viewBox="0 0 600 600"
                fill="none"
              >
                <motion.path
                  d="M300 37C349-7 429-7 478 37c49 43 78 128 78 227s-29 184-78 227c-49 44-129 44-178 0C221 448 192 363 192 264S251 80 300 37Z"
                  fill="url(#grad2)"
                  animate={{ 
                    rotate: [0, 360],
                    transition: { repeat: Infinity, duration: 60, ease: "linear" }
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