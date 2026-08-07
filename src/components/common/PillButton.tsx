import { cn } from "@/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { PillButton as UIPillButton } from "@/components/ui"

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
    <UIPillButton
      type="button"
      isActive={isActive}
      className={cn(
        "px-3.5 py-1.5 h-auto text-[12px] font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </UIPillButton>
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
