import type { ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/utils"

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  children: ReactNode
  onClose: () => void
  maxWidth?: "sm" | "md" | "lg"
  className?: string
}

/** Full-screen blurred backdrop + centred card panel. Click outside to close. */
export function Modal({ children, onClose, maxWidth = "md", className }: ModalProps) {
  const widthClass = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" }[maxWidth]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden",
          widthClass,
          className,
        )}
        style={{ background: "var(--card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ─── ModalHeader ──────────────────────────────────────────────────────────────

interface ModalHeaderProps {
  title: string
  subtitle?: ReactNode
  onClose: () => void
  /** Optional icon shown to the left of the title */
  icon?: ReactNode
}

export function ModalHeader({ title, subtitle, onClose, icon }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className="grid size-8 place-items-center rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <h2 className="text-[14px] font-bold text-[var(--foreground)]">{title}</h2>
          {subtitle && (
            <span className="text-[12px] text-[var(--muted-foreground)] truncate">{subtitle}</span>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="ml-3 flex-shrink-0 rounded-full p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition"
        aria-label="Închide"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// ─── ModalBody ────────────────────────────────────────────────────────────────

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("px-6 py-5 flex flex-col gap-4", className)}>
      {children}
    </div>
  )
}

// ─── ModalFooter ──────────────────────────────────────────────────────────────

interface ModalFooterProps {
  children: ReactNode
  /** "end" = justify-end (default) | "between" = justify-between */
  align?: "end" | "between"
}

export function ModalFooter({ children, align = "end" }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-6 py-4 border-t border-[var(--border)]",
        align === "between" ? "justify-between" : "justify-end",
      )}
    >
      {children}
    </div>
  )
}
