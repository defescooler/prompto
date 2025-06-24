import { cn } from "@/lib/utils"
import { tokens } from "@/lib/tokens"

export default function Section({ 
  children, 
  className, 
  maxWidth = true,
  padding = true,
  spacing = true,
  ...props 
}) {
  return (
    <section 
      className={cn(
        // Base section styles
        "relative isolate overflow-hidden",
        // Consistent max-width and centering
        maxWidth && tokens.layout.maxWidth,
        maxWidth && tokens.layout.container,
        // Consistent vertical spacing
        spacing && tokens.layout.section,
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
} 