import type { InputHTMLAttributes } from "react"
import { Search } from "lucide-react"
import { cn } from "@/utils"

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

export function SearchInput({ wrapperClassName, className, ...props }: SearchInputProps) {
  return (
    <label
      className={cn(
        "flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-[var(--muted-foreground)] shadow-xs transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20",
        wrapperClassName
      )}
    >
      <Search size={18} className="text-[var(--primary)] shrink-0" aria-hidden="true" />
      <input
        type="search"
        className={cn(
          "w-full border-0 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]",
          className
        )}
        {...props}
      />
    </label>
  )
}
