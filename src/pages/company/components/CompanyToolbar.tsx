import { SearchInput } from "@/components/common"
import { CompanyFilterPopover, activeFilterCount } from "./CompanyFilterPopover"
import type { CompanyFilters } from "./CompanyFilterPopover"
import { Button } from "@/components/ui"

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

      <Button
        type="button"
        variant={count ? "secondary" : "outline"}
        onClick={() => onFiltersOpenChange(!filtersOpen)}
        aria-expanded={filtersOpen}
        className="min-h-[42px] self-end sm:self-auto rounded-xl font-semibold"
      >
        Filtru{count ? ` (${count})` : ""}
      </Button>

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
