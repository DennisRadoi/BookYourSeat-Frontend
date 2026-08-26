import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { CompanyToolbar } from "./components/CompanyToolbar"
import { ColleaguesTable } from "./components/ColleaguesTable"
import type { CompanyFilters } from "./components/CompanyFilterPopover"
import { getBuildings, getColleaguesPage, toggleFavoriteColleague } from "@/services"
import { invalidateCachePrefix } from "@/services/cache"
import type { Colleague } from "@/types"
import { Button } from "@/components/ui"

const initialFilters: CompanyFilters = { status: "all", building: "all", favorite: "all" }
const PAGE_SIZE_OPTIONS = [5, 10, 20]

export default function CompanyPage() {
  const navigate = useNavigate()
  const [colleagues, setColleagues] = useState<Colleague[]>([])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
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
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  const sseRef = useRef<EventSource | null>(null)

  async function fetchColleagues() {
    setIsLoading(true)
    try {
      const result = await getColleaguesPage({
        search: debouncedQuery.trim() || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        building: filters.building === "all" ? undefined : filters.building,
        favorite: filters.favorite === "all" ? undefined : filters.favorite === "favorite",
        page,
        size: pageSize,
      })
      setColleagues(result.colleagues)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
    } catch (error) {
      console.error("Eroare la încărcarea colegilor:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchColleagues()
  }, [debouncedQuery, filters, page, pageSize])

  useEffect(() => {
    // Subscribe to server-sent events for real-time updates (cookie-based auth assumed)
    const apiBase = import.meta.env.DEV ? "/backend" : (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081")
    const baseNoApi = apiBase.replace(/\/api$/, "")
    const url = `${baseNoApi}/users/stream`

    let retryAttempt = 0
    let reconnectTimer: number | null = null
    let es: EventSource | null = null

    const cleanupEs = () => {
      if (es) {
        try { es.close() } catch (e) { /* ignore */ }
        es = null
      }
      if (reconnectTimer != null) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
    }

    const createEs = () => {
      cleanupEs()
      try {
        es = new EventSource(url)
        sseRef.current = es
      } catch (err) {
        console.error("Failed to create EventSource", err)
        scheduleReconnect()
        return
      }

      const onUserUpdated = (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as { userId: number; profilePhoto?: string | null }
          const { userId, profilePhoto } = payload
          // Build avatarUrl from profilePhoto (or null)
          const avatarUrl = profilePhoto ? `${baseNoApi}/api/uploads/profile-photos/${profilePhoto}` : null

          // Update local colleagues state optimistically
          setColleagues((current) => current.map((c) => c.id === userId ? { ...c, avatarUrl } : c))

          // Ensure cached pages don't remain stale — invalidate cached colleagues entries so future page navigations use fresh data
          invalidateCachePrefix("colleagues:")
        } catch (err) {
          console.error("Error handling SSE user-updated event", err)
        }
      }

      const onOpen = () => {
        retryAttempt = 0
        console.debug && console.debug("SSE connected")
      }

      const onError = (err: Event) => {
        console.warn("SSE error, scheduling reconnect", err)
        // Close and schedule reconnect with backoff
        try { es?.close() } catch (e) { /* ignore */ }
        sseRef.current = null
        scheduleReconnect()
      }

      es.addEventListener("user-updated", onUserUpdated as EventListener)
      es.addEventListener("open", onOpen as EventListener)
      es.addEventListener("error", onError as EventListener)
    }

    const scheduleReconnect = () => {
      if (reconnectTimer != null) return
      retryAttempt = Math.min(retryAttempt + 1, 10)
      const delay = Math.min(30_000, Math.pow(2, retryAttempt) * 1000)
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null
        createEs()
      }, delay)
      console.debug && console.debug(`SSE reconnect scheduled in ${delay}ms`)
    }

    // start
    createEs()

    return () => {
      cleanupEs()
      sseRef.current = null
    }
  }, [])


  function updateQuery(value: string) { setQuery(value); setPage(0) }
  function updateFilters(value: CompanyFilters) { setFilters(value); setPage(0) }

  async function handleToggleFavorite(id: number) {
    try {
      const currentColleague = colleagues.find((c) => c.id === id)
      const isFavorite = await toggleFavoriteColleague(id, currentColleague?.isFavorite ?? false)
      if (filters.favorite === "favorite" && !isFavorite) {
        setColleagues((current) => current.filter((colleague) => colleague.id !== id))
        setTotalElements((current) => Math.max(0, current - 1))
      } else {
        setColleagues((current) => current.map((colleague) => colleague.id === id ? { ...colleague, isFavorite } : colleague))
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
