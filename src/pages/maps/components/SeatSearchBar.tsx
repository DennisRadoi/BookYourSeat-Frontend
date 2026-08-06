import type { ReactElement } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

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
  placeholder = "Cauta un loc dupa nume sau zona",
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
          className="w-full h-11 pl-11 pr-4 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] shadow-xs transition-colors focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Button */}
      <button
        type="button"
        id="seat-filter-toggle-btn"
        onClick={onFilterClick}
        className="h-11 px-5 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm font-medium text-[var(--foreground)] shadow-xs hover:bg-[var(--muted)] transition-colors flex items-center gap-2 cursor-pointer"
      >
        <SlidersHorizontal size={15} className="text-[var(--muted-foreground)]" />
        <span>Filtru</span>
      </button>
    </div>
  )
}
