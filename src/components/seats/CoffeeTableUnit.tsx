import type { ReactElement } from "react"

export interface CoffeeTableUnitProps {
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Reusable Dark Coffee Table / Small Table ("Măsuță")
 */
export function CoffeeTableUnit({
  label,
  size = "md",
  className = "",
}: CoffeeTableUnitProps): ReactElement {
  let sizeStyles = "w-28 sm:w-36 h-20 sm:h-24 rounded-2xl"
  if (size === "sm") {
    sizeStyles = "w-20 sm:w-24 h-16 sm:h-18 rounded-xl"
  } else if (size === "lg") {
    sizeStyles = "w-36 sm:w-44 h-24 sm:h-28 rounded-2xl"
  }

  return (
    <div
      className={`${sizeStyles} bg-[#1e293b] border-2 border-[#334155] shadow-md flex items-center justify-center p-2 select-none ${className}`}
    >
      {label && (
        <span className="text-[11px] font-medium text-slate-200">
          {label}
        </span>
      )}
    </div>
  )
}
