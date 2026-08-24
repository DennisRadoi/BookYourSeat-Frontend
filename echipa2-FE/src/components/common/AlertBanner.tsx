import type { ReactNode } from "react"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/utils"

type AlertVariant = "error" | "success" | "warning" | "info"

interface AlertBannerProps {
  variant: AlertVariant
  children: ReactNode
  className?: string
}

const VARIANT_STYLES: Record<AlertVariant, string> = {
  error:
    "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]",
  success:
    "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  warning:
    "border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]",
  info:
    "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]",
}

const VARIANT_ICONS: Record<AlertVariant, ReactNode> = {
  error: <AlertCircle size={14} />,
  success: <CheckCircle2 size={14} />,
  warning: <AlertCircle size={14} />,
  info: <Info size={14} />,
}

/**
 * Inline alert/feedback banner used after form submissions or to surface errors.
 *
 * @example
 * {error && <AlertBanner variant="error">{error}</AlertBanner>}
 * {success && <AlertBanner variant="success">Salvat cu succes!</AlertBanner>}
 */
export function AlertBanner({ variant, children, className }: AlertBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[12px] font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {VARIANT_ICONS[variant]}
      <span>{children}</span>
    </div>
  )
}
