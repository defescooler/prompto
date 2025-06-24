import * as React from "react"

import { cn } from "@/lib/utils"
import { tokens } from "@/lib/tokens"

export default function Card({ 
  children, 
  className, 
  variant = "default",
  interactive = false,
  ...props 
}) {
  const baseStyles = [
    tokens.radius.xl,
    "shadow-lg"
  ]

  const variantStyles = {
    default: tokens.colors.surface[2],
    glass: tokens.colors.surface[1]
  }

  const interactiveStyles = interactive ? [
    "transition-all duration-300",
    "hover:shadow-xl/20",
    "hover:ring-white/20"
  ] : []

  return (
    <div 
      className={cn(
        ...baseStyles,
        ...(Array.isArray(variantStyles[variant]) ? variantStyles[variant] : [variantStyles[variant]]),
        ...interactiveStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props} />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props} />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (<div data-slot="card-content" className={cn("px-6", className)} {...props} />);
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
