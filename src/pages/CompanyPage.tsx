import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CompanyToolbar } from "@/components/company/CompanyToolbar"
import { ColleaguesTable } from "@/components/company/ColleaguesTable"
import type { CompanyFilters } from "@/components/company/CompanyFilterPopover"
import { getColleagues, toggleFavoriteColleague } from "@/services"
import type { Colleague } from "@/types"

const initialFilters: CompanyFilters = { status: "all", floor: "all", favorite: "all" }

export default function CompanyPage() {
  const navigate = useNavigate()
  const [colleagues, setColleagues] = useState<Colleague[]>([])
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<CompanyFilters>(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => { getColleagues().then(setColleagues).catch((error) => console.error("Eroare la încărcarea colegilor:", error)) }, [])

  const floors = useMemo(() => [...new Set(colleagues.map((colleague) => colleague.floor))].sort(), [colleagues])
  const visibleColleagues = useMemo(() => colleagues.filter((colleague) => {
    const matchesName = colleague.name.toLocaleLowerCase("ro-RO").includes(query.trim().toLocaleLowerCase("ro-RO"))
    const matchesStatus = filters.status === "all" || colleague.status === filters.status
    const matchesFloor = filters.floor === "all" || colleague.floor === filters.floor
    const matchesFavorite = filters.favorite === "all" || (filters.favorite === "favorite" ? colleague.isFavorite : !colleague.isFavorite)
    return matchesName && matchesStatus && matchesFloor && matchesFavorite
  }), [colleagues, query, filters])

  async function handleToggleFavorite(id: number) {
    try { const updated = await toggleFavoriteColleague(id); setColleagues((current) => current.map((colleague) => colleague.id === updated.id ? updated : colleague)) }
    catch (error) { console.error("Eroare la actualizarea favoritului:", error) }
  }

  return <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"><div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8"><CompanyToolbar query={query} filters={filters} floors={floors} filtersOpen={filtersOpen} onQueryChange={setQuery} onFiltersChange={setFilters} onFiltersOpenChange={setFiltersOpen} /><ColleaguesTable colleagues={visibleColleagues} onToggleFavorite={handleToggleFavorite} onViewProfile={(colleague) => navigate(`/companie/${colleague.name.toLocaleLowerCase("ro-RO").replaceAll(" ", "-")}`)} /></div></section>
}
