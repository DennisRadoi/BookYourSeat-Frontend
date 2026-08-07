import { Button, PillButton } from "@/components/ui"

export interface CompanyFilters {
  status: string    // "all" | "La birou" | "Remote"
  floor: string     // "all" | floor name
  favorite: string  // "all" | "favorite" | "non-favorite"
}

interface CompanyFilterPopoverProps {
  open: boolean
  filters: CompanyFilters
  floors: string[]
  onChange: (filters: CompanyFilters) => void
  onClose: () => void
}

export function activeFilterCount(filters: CompanyFilters): number {
  let count = 0
  if (filters.status && filters.status !== "all") count++
  if (filters.floor && filters.floor !== "all") count++
  if (filters.favorite && filters.favorite !== "all") count++
  return count
}

const STATUS_OPTIONS = [
  { value: "all", label: "Toți" },
  { value: "La birou", label: "La birou" },
  { value: "Remote", label: "Remote" },
]

const FAVORITE_OPTIONS = [
  { value: "all", label: "Toți" },
  { value: "favorite", label: "Favoriți" },
  { value: "non-favorite", label: "Ceilalți" },
]

export function CompanyFilterPopover({
  open,
  filters,
  floors,
  onChange,
  onClose,
}: CompanyFilterPopoverProps) {
  if (!open) return null

  function update(patch: Partial<CompanyFilters>) {
    onChange({ ...filters, ...patch })
  }

  function reset() {
    onChange({ status: "all", floor: "all", favorite: "all" })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl"
        role="dialog"
        aria-label="Filtre colegi"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-bold text-[var(--foreground)]">Filtre</span>
          {activeFilterCount(filters) > 0 && (
            <Button
              variant="link"
              size="xs"
              onClick={reset}
              className="h-auto p-0 font-semibold text-[var(--primary)] hover:underline"
            >
              Resetează
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Status
          </p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => (
              <PillButton
                key={opt.value}
                type="button"
                size="xs"
                isActive={filters.status === opt.value}
                onClick={() => update({ status: opt.value })}
              >
                {opt.label}
              </PillButton>
            ))}
          </div>
        </div>

        {/* Floor */}
        {floors.length > 0 && (
          <div className="mb-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Etaj / Locație
            </p>
            <div className="flex gap-2 flex-wrap">
              <PillButton
                type="button"
                size="xs"
                isActive={filters.floor === "all"}
                onClick={() => update({ floor: "all" })}
              >
                Toate
              </PillButton>
              {floors.map((fl) => (
                <PillButton
                  key={fl}
                  type="button"
                  size="xs"
                  isActive={filters.floor === fl}
                  onClick={() => update({ floor: fl })}
                >
                  {fl}
                </PillButton>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Favoriți
          </p>
          <div className="flex gap-2 flex-wrap">
            {FAVORITE_OPTIONS.map((opt) => (
              <PillButton
                key={opt.value}
                type="button"
                size="xs"
                isActive={filters.favorite === opt.value}
                onClick={() => update({ favorite: opt.value })}
              >
                {opt.label}
              </PillButton>
            ))}
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full font-bold"
        >
          Aplică
        </Button>
      </div>
    </>
  )
}
