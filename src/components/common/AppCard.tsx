import type { ReactNode } from "react"
import { cn } from "@/utils"

interface AppCardProps {
  children: ReactNode
  className?: string
}

export function AppCard({ children, className }: AppCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_1px_6px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      {children}
    </div>
  )
}

interface AppCardHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}

export function AppCardHeader({ title, subtitle, action, className }: AppCardHeaderProps) {
  return (
    <div className={cn("flex flex-row items-center justify-between pb-3", className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[15px] font-bold text-[var(--foreground)]">{title}</h2>
        {subtitle && <span className="text-[12px] text-[var(--muted-foreground)]">{subtitle}</span>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
