import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CompanyToolbar } from "./components/CompanyToolbar"
import { ColleaguesTable } from "./components/ColleaguesTable"
import type { CompanyFilters } from "./components/CompanyFilterPopover"
import { getBuildings, getColleaguesPage, toggleFavoriteColleague } from "@/services"
import type { Colleague } from "@/types"
import { Button } from "@/components/ui"

const initialFilters: CompanyFilters = { status: "all", building: "all", favorite: "all" }
const PAGE_SIZE_OPTIONS = [5, 10, 20]

export default function CompanyPage() {
  const navigate = useNavigate()
  const [colleagues, setColleagues] = useState<Colleague[]>([])
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<CompanyFilters>(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [buildings, setBuildings] = useState<string[]>([])

  useEffect(() => {
    getBuildings().then((data) => setBuildings(data.map((building) => building.name))).catch((error) => console.error("Eroare la încărcarea clădirilor:", error))
  }, [])

  useEffect(() => {
    let active = true
    getColleaguesPage({
      search: query.trim() || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      building: filters.building === "all" ? undefined : filters.building,
      favorite: filters.favorite === "all" ? undefined : filters.favorite === "favorite",
      page,
      size: pageSize,
    }).then((result) => {
      if (!active) return
      setColleagues(result.colleagues)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
    }).catch((error) => console.error("Eroare la încărcarea colegilor:", error))
      .finally(() => active && setIsLoading(false))
    return () => { active = false }
  }, [query, filters, page, pageSize])

  function updateQuery(value: string) { setQuery(value); setPage(0) }
  function updateFilters(value: CompanyFilters) { setFilters(value); setPage(0) }

  async function handleToggleFavorite(id: number) {
    try {
      const updated = await toggleFavoriteColleague(id)
      if (filters.favorite !== "all" && (filters.favorite === "favorite") !== updated.isFavorite) {
        setPage(0)
      } else {
        setColleagues((current) => current.map((colleague) => colleague.id === id ? updated : colleague))
      }
    } catch (error) { console.error("Eroare la actualizarea favoritului:", error) }
  }

  const pageLabel = totalElements === 0 ? "Niciun coleg" : `Pagina ${page + 1} din ${Math.max(totalPages, 1)} · ${totalElements} colegi`

  return <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"><div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
    <CompanyToolbar query={query} filters={filters} buildings={buildings} filtersOpen={filtersOpen} onQueryChange={updateQuery} onFiltersChange={updateFilters} onFiltersOpenChange={setFiltersOpen} />
    {isLoading ? <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">Se încarcă colegii...</p> : <ColleaguesTable colleagues={colleagues} onToggleFavorite={handleToggleFavorite} onViewProfile={(colleague) => navigate(`/companie/${colleague.id}`)} />}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 max-w-[920px]">
      <p className="text-xs text-[var(--muted-foreground)]">{pageLabel}</p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          Afișează
          <select
            value={pageSize}
            onChange={(event) => { setPageSize(Number(event.target.value)); setPage(0) }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
            aria-label="Număr colegi pe pagină"
          >
            {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          colegi / pagină
        </label>
        <Button size="sm" variant="outline" disabled={page === 0 || isLoading} onClick={() => setPage((current) => current - 1)}>Înapoi</Button>
        <Button size="sm" variant="outline" disabled={page + 1 >= totalPages || isLoading} onClick={() => setPage((current) => current + 1)}>Înainte</Button>
      </div>
    </div>
  </div></section>
}
