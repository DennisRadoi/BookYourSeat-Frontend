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
    <section className="min-h-screen bg-[#f3f4f6] text-[#1f2937]">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <label className="flex min-h-12 max-w-[690px] flex-1 items-center gap-2.5 rounded-[14px] border border-[#e5e7eb] bg-white px-4 text-[#6b7280] shadow-sm transition focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/20">
            <Search size={19} className="text-[#059669]" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Caută un coleg după nume"
              aria-label="Caută un coleg după nume"
              className="w-full border-0 bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-[#6b7280]"
            />
          </label>
          <button
            type="button"
            className={`min-h-[42px] self-end rounded-[13px] border bg-white px-[18px] text-sm font-semibold transition sm:self-auto ${
              isOfficeOnly
                ? "border-[#059669] bg-[#d1fae5] text-[#059669]"
                : "border-[#e5e7eb] text-[#1f2937] hover:border-[#059669] hover:text-[#059669]"
            }`}
            onClick={() => setIsOfficeOnly((active) => !active)}
            aria-pressed={isOfficeOnly}
          >
            Filtru
          </button>
        </div>

        <div className="max-w-[920px] overflow-x-auto rounded-[20px] border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
          <table className="w-full min-w-[680px] table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th scope="col" className="py-3 pt-[17px] pr-3 pb-3 pl-[22px] text-left text-xs font-semibold text-[#6b7280]">Coleg</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[#6b7280]">Status</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[#6b7280]">Locație</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[#6b7280]">Favorit</th>
                <th scope="col" className="py-3 pt-[17px] pr-[22px] pl-3 text-left text-xs font-semibold text-[#6b7280]"><span className="sr-only">Profil</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleColleagues.map((colleague) => {
                const isFavorite = colleague.isFavorite
                return (
                  <tr key={colleague.id} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#f3f4f6]/60 transition">
                    <td className="py-3 pr-3 pl-[22px] align-middle text-[13px]">
                      <div className="flex items-center gap-[13px]">
                        <span className="grid size-[30px] shrink-0 place-items-center rounded-full border-2 border-[#059669] bg-[#d1fae5] text-[11px] font-bold text-[#059669]" aria-hidden="true">
                          {getInitials(colleague.name)}
                        </span>
                        <div>
                          <div className="leading-[1.1] font-bold text-[#1f2937]">{colleague.name}</div>
                          <div className="mt-[3px] text-[11px] leading-[1.1] text-[#6b7280]">{colleague.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle text-[13px]">
                      <span className={`inline-flex min-w-[74px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${colleague.status === "La birou" ? "bg-[#d1fae5] text-[#059669]" : "bg-[#fee2e2] text-[#ef4444]"}`}>
                        {colleague.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-middle text-xs leading-[1.2] font-semibold text-[#1f2937]">
                      <span className="block">{colleague.floor}</span>
                    </td>
                    <td className="px-3 py-3 align-middle text-[13px]">
                      <button
                        type="button"
                        className={`p-1 leading-none transition ${isFavorite ? "text-[#f59e0b]" : "text-[#e5e7eb] hover:text-[#f59e0b]"}`}
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
                        className="whitespace-nowrap bg-transparent p-0 text-xs font-bold text-[#059669] hover:text-[#047857] hover:underline"
                      >
                        Vezi profil
                      </button>
                    </td>
                  </tr>
                )
              })}
              {visibleColleagues.length === 0 && (
                <tr>
                  <td className="px-6 py-[42px] text-center text-[#6b7280]" colSpan={5}>
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
