import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { tokens } from "@/lib/tokens"
import { cn } from "@/lib/utils"

export default function AuthCard({
  children,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  oauthProviders = [],
  showDivider = true,
  className,
  ...props
}) {
  return (
    <Card 
      variant="glass" 
      className={cn("w-full max-w-md mx-auto p-8 space-y-6", className)}
      {...props}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {title && (
            <h1 className={cn(tokens.typography.title, tokens.colors.text.primary)}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={cn(tokens.typography.body, tokens.colors.text.secondary)}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* OAuth Providers */}
      {oauthProviders.length > 0 && (
        <div className="space-y-3">
          {oauthProviders.map((provider, index) => (
            <Button
              key={index}
              variant="secondary"
              className="w-full"
              onClick={provider.onClick}
              disabled={provider.disabled}
            >
              {provider.icon && <provider.icon className={cn(tokens.icon.className, "mr-2")} />}
              {provider.label}
            </Button>
          ))}
        </div>
      )}

      {/* Divider */}
      {showDivider && oauthProviders.length > 0 && (
        <div className="relative">
          <Separator className={tokens.colors.border.subtle} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "px-3 text-xs",
              tokens.colors.surface[0],
              tokens.colors.text.muted
            )}>
              or
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        {children}
      </div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="space-y-3">
          {primaryAction && (
            <Button
              variant="primary"
              className="w-full"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.icon && <primaryAction.icon className={cn(tokens.icon.className, "mr-2")} />}
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="link"
              className="w-full"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </Card>
  )
} 