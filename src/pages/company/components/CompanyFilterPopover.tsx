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
            <button
              onClick={reset}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
            >
              Resetează
            </button>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Status
          </p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ status: opt.value })}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold border transition ${
                  filters.status === opt.value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {opt.label}
              </button>
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
              <button
                onClick={() => update({ floor: "all" })}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold border transition ${
                  filters.floor === "all"
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                Toate
              </button>
              {floors.map((fl) => (
                <button
                  key={fl}
                  onClick={() => update({ floor: fl })}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold border transition ${
                    filters.floor === fl
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {fl}
                </button>
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
              <button
                key={opt.value}
                onClick={() => update({ favorite: opt.value })}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold border transition ${
                  filters.favorite === opt.value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[var(--primary)] py-2 text-[13px] font-bold text-[var(--primary-foreground)] hover:bg-[var(--sidebar-accent-hover)] transition"
        >
          Aplică
        </button>
      </div>
    </>
  )
}
