import type { ReactNode, ReactElement } from "react"
import { cn } from "@/utils"

export type FilterPillVariant = "primary" | "dark" | "outline"

interface FilterPillProps {
  children: ReactNode
  active?: boolean
  variant?: FilterPillVariant
  onClick?: () => void
  className?: string
  disabled?: boolean
  id?: string
  ariaLabel?: string
}

export function FilterPill({
  children,
  active = false,
  variant = "outline",
  onClick,
  className = "",
  disabled = false,
  id,
  ariaLabel,
}: FilterPillProps): ReactElement {
  let variantStyles = ""

  if (active) {
    if (variant === "primary") {
      variantStyles =
        "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-semibold shadow-xs"
    } else if (variant === "dark") {
      variantStyles =
        "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] font-semibold shadow-xs"
    }
  } else {
    variantStyles =
      "bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)] hover:bg-[var(--muted)] font-normal"
  }

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer border select-none disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles,
        className,
      )}
    >
      {children}
    </button>
  )
}
