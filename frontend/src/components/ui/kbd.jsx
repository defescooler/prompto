import { cn } from "@/lib/utils"
import { tokens } from "@/lib/tokens"

export default function Kbd({ children, className, ...props }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "px-2 py-1 text-xs font-mono font-medium",
        "bg-slate-800/60 text-slate-300",
        "border border-slate-700/50",
        "rounded-md shadow-sm",
        "min-w-[1.5rem] h-6",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
} 