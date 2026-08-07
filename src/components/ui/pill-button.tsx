import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { cn } from "@/lib/utils"

export interface PillButtonProps extends Omit<ButtonProps, "variant"> {
  isActive?: boolean
  activeVariant?: ButtonProps["variant"]
  inactiveVariant?: ButtonProps["variant"]
}

export const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      className,
      isActive = false,
      activeVariant = "default",
      inactiveVariant = "outline",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={isActive ? activeVariant : inactiveVariant}
        className={cn(
          "rounded-full transition-all duration-200 cursor-pointer",
          isActive ? "shadow-xs font-semibold" : "opacity-80 hover:opacity-100",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

PillButton.displayName = "PillButton"

export interface PillGroupProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

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
