import { Link } from 'react-router-dom'
import { Github, Instagram } from 'lucide-react'

// TikTok icon component
const TikTokIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.38-2.016-1.38-3.338h-3.064v13.814a3.618 3.618 0 0 1-3.615 3.615c-1.993 0-3.615-1.622-3.615-3.615s1.622-3.615 3.615-3.615c.373 0 .732.057 1.069.162V8.283a6.675 6.675 0 0 0-1.069-.087c-3.675 0-6.658 2.983-6.658 6.658S8.007 21.512 11.682 21.512s6.658-2.983 6.658-6.658V8.862a9.29 9.29 0 0 0 4.981 1.448V7.267c-1.253 0-2.409-.491-3.262-1.298-.426-.404-.78-.87-1.04-1.407z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          {/* Left side - Made with love */}
          <div className="flex items-center gap-2 text-slate-400">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by</span>
            <a 
              href="https://github.com/defescooler"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              defescooler
            </a>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/defescooler/prompto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/engineerofvibes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@engineerofvibes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 