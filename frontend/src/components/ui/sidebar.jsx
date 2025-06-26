import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx'
import { Home, Sparkles, History, Settings, LogOut, User } from 'lucide-react'
import { Logo } from '@/components/icons.jsx'
import { useAuth } from '@/hooks/useAuth'



const SidebarButton = ({ icon: Icon, label, active = false, onClick, className = '' }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className={`
            w-11 h-11 p-0 relative group transition-all duration-300 rounded-xl
            ${active 
              ? 'text-[#22c55e] bg-[#22c55e]/20 shadow-lg shadow-[#22c55e]/30 scale-105' 
              : 'text-[#94a3b8] hover:text-[#22c55e] hover:bg-[#334155] hover:scale-105'
            }
            ${className}
          `}
        >
          <Icon className={`w-5 h-5 transition-all duration-300 ${active ? 'drop-shadow-[0_0_12px_#22c55e]' : 'group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#22c55e]'}`} />
          {active && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#22c55e] rounded-r-full animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-[#22c55e]/10 animate-pulse" />
            </>
          )}
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#22c55e]/30 transition-all duration-300" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        className="bg-[#0f172a] border-[#22c55e]/30 text-[#22c55e] font-medium shadow-lg shadow-[#22c55e]/10"
        sideOffset={12}
      >
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default function Sidebar({ activeTab = 'dashboard', onTabChange }) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'enhance', icon: Sparkles, label: 'Enhance' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="w-16 bg-gradient-to-b from-[#0f172a] to-[#0a0f14] h-screen flex flex-col items-center py-6 border-r border-[#22c55e]/10 relative group shadow-xl">
      {/* Ambient glow effect */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#22c55e]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#22c55e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Logo */}
      <div className="mb-8 relative">
        <div className="absolute -inset-3 bg-[#22c55e]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="w-10 h-10 bg-[#22c55e]/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-[#22c55e]/20">
          <Logo className="w-6 h-6 text-[#22c55e] relative z-10 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_#22c55e]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-3">
        {navItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => onTabChange?.(item.id)}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#334155] to-transparent my-4" />

      {/* User Section */}
      <div className="space-y-3">
        <SidebarButton
          icon={User}
          label={user?.email?.split('@')[0] || 'Profile'}
          className="hover:bg-blue-500/10 hover:text-blue-400"
        />
        <SidebarButton
          icon={LogOut}
          label="Sign Out"
          onClick={logout}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20"
        />
      </div>

      {/* Status Indicator */}
      <div className="absolute bottom-3 right-3 flex items-center space-x-1">
        <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_6px_#22c55e]" />
        <div className="w-1 h-1 bg-[#22c55e]/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  )
}
