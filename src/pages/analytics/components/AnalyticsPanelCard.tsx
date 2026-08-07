import { type ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface AnalyticsPanelCardProps {
  title: string
  className?: string
  children: ReactNode
}

export function AnalyticsPanelCard({ title, className = "", children }: AnalyticsPanelCardProps) {
  return (
    <Card className={`rounded-2xl border border-border/60 bg-card p-5 shadow-sm ${className}`}>
      <h3 className="mb-4 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </Card>
  )
}
