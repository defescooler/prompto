import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// TikTok icon component
const TikTokIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.38-2.016-1.38-3.338h-3.064v13.814a3.618 3.618 0 0 1-3.615 3.615c-1.993 0-3.615-1.622-3.615-3.615s1.622-3.615 3.615-3.615c.373 0 .732.057 1.069.162V8.283a6.675 6.675 0 0 0-1.069-.087c-3.675 0-6.658 2.983-6.658 6.658S8.007 21.512 11.682 21.512s6.658-2.983 6.658-6.658V8.862a9.29 9.29 0 0 0 4.981 1.448V7.267c-1.253 0-2.409-.491-3.262-1.298-.426-.404-.78-.87-1.04-1.407z"/>
  </svg>
)

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-30% 0px -30% 0px'
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Trigger element positioned at 30% scroll */}
      <div ref={observerRef} className="absolute top-[30%] w-full h-1 pointer-events-none" />
      
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-t border-slate-800/50 bg-slate-950/90 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            {/* Compact badge */}
            <div className="flex items-center gap-3 text-sm bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
              <span className="text-slate-400">Built by</span>
              <a 
                href="https://github.com/defescooler"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                defescooler
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </>
  )
} 