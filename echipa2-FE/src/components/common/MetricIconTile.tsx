import type { ReactNode } from "react"
import { cn } from "@/utils"

interface MetricIconTileProps {
  icon: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  className?: string
}

export function MetricIconTile({ icon, title, subtitle, className }: MetricIconTileProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      {(title || subtitle) && (
        <div className="min-w-0">
          {subtitle && <div className="text-xs text-[var(--muted-foreground)]">{subtitle}</div>}
          {title && <div className="font-semibold text-[var(--foreground)] truncate">{title}</div>}
        </div>
      )}
    </div>
  )
}
