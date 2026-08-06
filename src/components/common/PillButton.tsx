import { cn } from "@/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"

// ─── PillButton ───────────────────────────────────────────────────────────────

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  children: ReactNode
}

/**
 * Togglable pill / chip button.
 * Used for filter groups, status selectors, recurrence options, etc.
 *
 * @example
 * <PillButton isActive={status === "confirmed"} onClick={() => setStatus("confirmed")}>
 *   Confirmat
 * </PillButton>
 */
export function PillButton({ isActive, children, className, ...props }: PillButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
        isActive
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
          : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── PillGroup ────────────────────────────────────────────────────────────────

interface PillGroupProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/**
 * Renders a group of PillButtons where only one can be active at a time.
 *
 * @example
 * <PillGroup
 *   options={[{ value: "confirmed", label: "Confirmat" }, ...]}
 *   value={status}
 *   onChange={setStatus}
 * />
 */
export function PillGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: PillGroupProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <PillButton
          key={opt.value}
          isActive={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </PillButton>
      ))}
    </div>
  )
}
