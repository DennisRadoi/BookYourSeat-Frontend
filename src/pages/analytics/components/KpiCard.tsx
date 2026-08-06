import type { ReactNode } from "react"

interface KpiCardProps {
  icon: ReactNode
  value: string
  label: string
}

export function KpiCard({ icon, value, label }: KpiCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:h-12 sm:w-12">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
          {value}
        </p>
        <p className="truncate text-xs text-muted-foreground sm:text-[13px]">
          {label}
        </p>
      </div>
    </div>
  )
}