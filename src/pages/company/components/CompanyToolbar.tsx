import { SearchInput } from "@/components/common"
import { CompanyFilterPopover, activeFilterCount } from "./CompanyFilterPopover"
import type { CompanyFilters } from "./CompanyFilterPopover"

interface CompanyToolbarProps {
  query: string
  filters: CompanyFilters
  floors: string[]
  filtersOpen: boolean
  onQueryChange: (query: string) => void
  onFiltersChange: (filters: CompanyFilters) => void
  onFiltersOpenChange: (open: boolean) => void
}

export function CompanyToolbar({
  query,
  filters,
  floors,
  filtersOpen,
  onQueryChange,
  onFiltersChange,
  onFiltersOpenChange,
}: CompanyToolbarProps) {
  const count = activeFilterCount(filters)

  return (
    <div className="relative mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <div className="max-w-[690px] flex-1">
        <SearchInput
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Caută un coleg după nume"
          aria-label="Caută un coleg după nume"
        />
      </div>

      <button
        type="button"
        className={`min-h-[42px] self-end rounded-xl border bg-[var(--card)] px-[18px] text-sm font-semibold transition sm:self-auto ${
          count
            ? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]"
            : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
        }`}
        onClick={() => onFiltersOpenChange(!filtersOpen)}
        aria-expanded={filtersOpen}
      >
        Filtru{count ? ` (${count})` : ""}
      </button>

      <CompanyFilterPopover
        open={filtersOpen}
        filters={filters}
        floors={floors}
        onChange={onFiltersChange}
        onClose={() => onFiltersOpenChange(false)}
      />
    </div>
  )
}
