import type { ReactNode } from "react"
import { cn } from "@/utils"

interface InfoCardProps {
  title: ReactNode
  text?: ReactNode
  children?: ReactNode
  className?: string
}

export function InfoCard({ title, text, children, className }: InfoCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5",
        className
      )}
    >
      <h3 className="text-xs font-bold text-[var(--foreground)]">{title}</h3>
      {text && <p className="mt-3 text-xs text-[var(--muted-foreground)]">{text}</p>}
      {children}
    </article>
  )
}
