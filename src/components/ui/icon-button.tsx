import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { cn } from "@/lib/utils"

export interface IconButtonProps extends ButtonProps {
  label?: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "icon", label, "aria-label": ariaLabel, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={label || ariaLabel}
        className={cn("shrink-0", className)}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

IconButton.displayName = "IconButton"
