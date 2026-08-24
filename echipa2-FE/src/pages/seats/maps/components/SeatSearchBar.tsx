import type { ReactElement } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button, IconButton } from "@/components/ui"

interface SeatSearchBarProps {
  query: string
  onQueryChange: (val: string) => void
  onFilterClick?: () => void
  placeholder?: string
  className?: string
}

export function SeatSearchBar({
  query,
  onQueryChange,
  onFilterClick,
  placeholder = "Caută o sală (ex: Sala Tenis, Gaming, 404) sau loc...",
  className = "",
}: SeatSearchBarProps): ReactElement {
  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
        />
        <input
          type="text"
          id="seat-search-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-11 pr-10 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] shadow-xs transition-colors focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        {query && (
          <IconButton
            type="button"
            size="xs"
            variant="ghost"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-xs text-[var(--muted-foreground)]"
          >
            ✕
          </IconButton>
        )}
      </div>

      {/* Filter Button (render optional) */}
      {onFilterClick && (
        <Button
          type="button"
          id="seat-filter-toggle-btn"
          variant="outline"
          onClick={onFilterClick}
          leftIcon={<SlidersHorizontal size={15} className="text-[var(--muted-foreground)]" />}
          className="h-11 px-5 rounded-full text-sm font-medium"
        >
          Filtru
        </Button>
      )}
    </div>
  )
}
