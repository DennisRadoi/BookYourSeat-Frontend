import { useEffect, useMemo, useState } from "react"
import { Search, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getColleagues, toggleFavoriteColleague } from "@/services"
import { getInitials } from "@/utils"
import type { Colleague } from "@/types"

export default function CompanyPage() {
  const navigate = useNavigate()
  const [colleaguesList, setColleaguesList] = useState<Colleague[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isOfficeOnly, setIsOfficeOnly] = useState(false)

  useEffect(() => {
    async function loadColleagues() {
      try {
        const data = await getColleagues()
        setColleaguesList(data)
      } catch (error) {
        console.error("Eroare la încărcarea listei de colegi:", error)
      }
    }

    loadColleagues()
  }, [])

  const visibleColleagues = useMemo(() => {
    const normalisedQuery = searchQuery.trim().toLocaleLowerCase("ro-RO")
    return colleaguesList.filter((colleague) => {
      const matchesQuery = colleague.name.toLocaleLowerCase("ro-RO").includes(normalisedQuery)
      return matchesQuery && (!isOfficeOnly || colleague.status === "La birou")
    })
  }, [colleaguesList, searchQuery, isOfficeOnly])

  async function handleToggleFavorite(colleagueId: number) {
    try {
      const updated = await toggleFavoriteColleague(colleagueId)
      setColleaguesList((current) =>
        current.map((c) => (c.id === updated.id ? updated : c)),
      )
    } catch (error) {
      console.error("Eroare la actualizarea favoritului:", error)
    }
  }

  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <label className="flex min-h-12 max-w-[690px] flex-1 items-center gap-2.5 rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-4 text-[var(--muted-foreground)] shadow-sm transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
            <Search size={19} className="text-[var(--primary)]" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Caută un coleg după nume"
              aria-label="Caută un coleg după nume"
              className="w-full border-0 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </label>
          <button
            type="button"
            className={`min-h-[42px] self-end rounded-[13px] border bg-[var(--card)] px-[18px] text-sm font-semibold transition sm:self-auto ${
              isOfficeOnly
                ? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
            onClick={() => setIsOfficeOnly((active) => !active)}
            aria-pressed={isOfficeOnly}
          >
            Filtru
          </button>
        </div>

        <div className="max-w-[920px] overflow-x-auto rounded-[20px] border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
          <table className="w-full min-w-[680px] table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th scope="col" className="py-3 pt-[17px] pr-3 pb-3 pl-[22px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Coleg</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Status</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Locație</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Favorit</th>
                <th scope="col" className="py-3 pt-[17px] pr-[22px] pl-3 text-left text-xs font-semibold text-[var(--muted-foreground)]"><span className="sr-only">Profil</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleColleagues.map((colleague) => {
                const isFavorite = colleague.isFavorite
                return (
                  <tr key={colleague.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)]/60 transition">
                    <td className="py-3 pr-3 pl-[22px] align-middle text-[13px]">
                      <div className="flex items-center gap-[13px]">
                        <span className="grid size-[30px] shrink-0 place-items-center rounded-full border-2 border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)] text-[11px] font-bold" aria-hidden="true">
                          {getInitials(colleague.name)}
                        </span>
                        <div>
                          <div className="leading-[1.1] font-bold text-[var(--foreground)]">{colleague.name}</div>
                          <div className="mt-[3px] text-[11px] leading-[1.1] text-[var(--muted-foreground)]">{colleague.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle text-[13px]">
                      <span className={`inline-flex min-w-[74px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${colleague.status === "La birou" ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]" : "bg-[var(--destructive)]/20 text-[var(--destructive)]"}`}>
                        {colleague.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-middle text-xs leading-[1.2] font-semibold text-[var(--foreground)]">
                      <span className="block">{colleague.floor}</span>
                    </td>
                    <td className="px-3 py-3 align-middle text-[13px]">
                      <button
                        type="button"
                        className={`p-1 leading-none transition ${isFavorite ? "text-[var(--warning)]" : "text-[var(--border)] hover:text-[var(--warning)]"}`}
                        onClick={() => handleToggleFavorite(colleague.id)}
                        aria-label={`${isFavorite ? "Elimină" : "Adaugă"} ${colleague.name} ${isFavorite ? "din" : "la"} favorite`}
                      >
                        <Star size={19} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
                      </button>
                    </td>
                    <td className="py-3 pr-[22px] pl-3 align-middle text-[13px]">
                      <button
                        type="button"
                        onClick={() => navigate(`/companie/${colleague.name.toLocaleLowerCase("ro-RO").replaceAll(" ", "-")}`)}
                        className="whitespace-nowrap bg-transparent p-0 text-xs font-bold text-[var(--primary)] hover:text-[var(--sidebar-accent-hover)] hover:underline"
                      >
                        Vezi profil
                      </button>
                    </td>
                  </tr>
                )
              })}
              {visibleColleagues.length === 0 && (
                <tr>
                  <td className="px-6 py-[42px] text-center text-[var(--muted-foreground)]" colSpan={5}>
                    Nu am găsit colegi care să corespundă căutării.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
