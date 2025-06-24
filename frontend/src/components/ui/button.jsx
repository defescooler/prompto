import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { tokens } from "@/lib/tokens"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-350 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1629]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-slate-950 font-semibold shadow-lg hover:shadow-xl motion-safe:hover:scale-105 motion-reduce:hover:scale-100 active:scale-97 rounded-full",
        secondary:
          "text-emerald-400 ring-1 ring-emerald-500/40 hover:bg-white/5 motion-safe:hover:scale-105 motion-reduce:hover:scale-100 active:scale-97 rounded-full",
        link: 
          "text-emerald-400 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-8 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-4 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
