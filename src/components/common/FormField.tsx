import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react"
import { cn } from "@/utils"

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: ReactNode
  children: ReactNode
  className?: string
}

/** Vertical label + input wrapper used in modals and forms. */
export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── FormInput ────────────────────────────────────────────────────────────────

type FormInputProps = InputHTMLAttributes<HTMLInputElement>

/** Styled text / date / time input that matches the design system. */
export function FormInput({ className, ...props }: FormInputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5",
        "text-[13px] font-medium text-[var(--foreground)]",
        "outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

// ─── FormTextarea ─────────────────────────────────────────────────────────────

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

/** Styled textarea that matches the design system. */
export function FormTextarea({ className, ...props }: FormTextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5",
        "text-[13px] font-medium text-[var(--foreground)]",
        "outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition",
        "placeholder:text-[var(--muted-foreground)] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
