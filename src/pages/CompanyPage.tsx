import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CompanyToolbar } from "@/components/company/CompanyToolbar"
import { ColleaguesTable } from "@/components/company/ColleaguesTable"
import { getColleagues, toggleFavoriteColleague } from "@/services"
import type { Colleague } from "@/types"

export default function CompanyPage() {
  const navigate = useNavigate()
  const [colleagues, setColleagues] = useState<Colleague[]>([])
  const [query, setQuery] = useState("")
  const [officeOnly, setOfficeOnly] = useState(false)

  useEffect(() => {
    getColleagues().then(setColleagues).catch((error) => console.error("Eroare la încărcarea colegilor:", error))
  }, [])

  const visibleColleagues = useMemo(() => colleagues.filter((colleague) => colleague.name.toLocaleLowerCase("ro-RO").includes(query.trim().toLocaleLowerCase("ro-RO")) && (!officeOnly || colleague.status === "La birou")), [colleagues, query, officeOnly])

  async function handleToggleFavorite(id: number) {
    try {
      const updated = await toggleFavoriteColleague(id)
      setColleagues((current) => current.map((colleague) => colleague.id === updated.id ? updated : colleague))
    } catch (error) { console.error("Eroare la actualizarea favoritului:", error) }
  }

  return <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"><div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8"><CompanyToolbar query={query} officeOnly={officeOnly} onQueryChange={setQuery} onOfficeOnlyChange={() => setOfficeOnly((current) => !current)} /><ColleaguesTable colleagues={visibleColleagues} onToggleFavorite={handleToggleFavorite} onViewProfile={(colleague) => navigate(`/companie/${colleague.name.toLocaleLowerCase("ro-RO").replaceAll(" ", "-")}`)} /></div></section>
}
