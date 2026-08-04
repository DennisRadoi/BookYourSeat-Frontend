import { Search, Star } from "lucide-react"
import { useMemo, useState } from "react"

type Colleague = {
  name: string
  role: string
  status: "La birou" | "Remote"
  location: string[]
  favorite: boolean
}

const colleagues: Colleague[] = [
  { name: "Ruxandra Bituleanu", role: "Product Designer", status: "La birou", location: ["Stand-up Chat room", "T1, Etaj 1"], favorite: true },
  { name: "Denis Radoi", role: "Backend Engineer", status: "Remote", location: ["Remote azi"], favorite: false },
  { name: "Ana Hirceanu", role: "Frontend Engineer", status: "La birou", location: ["404", "T2, Etaj 2"], favorite: true },
  { name: "Bunea George", role: "QA", status: "Remote", location: ["Remote azi"], favorite: false },
  { name: "Ciupitu Claudiu", role: "HR", status: "La birou", location: ["Lounge", "T1, Parter"], favorite: false },
]

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2)
}

export default function CompanyPage() {
  const [query, setQuery] = useState("")
  const [officeOnly, setOfficeOnly] = useState(false)
  const [favorites, setFavorites] = useState(() => new Set(colleagues.filter(({ favorite }) => favorite).map(({ name }) => name)))

  const visibleColleagues = useMemo(() => {
    const normalisedQuery = query.trim().toLocaleLowerCase("ro-RO")
    return colleagues.filter((colleague) => {
      const matchesQuery = colleague.name.toLocaleLowerCase("ro-RO").includes(normalisedQuery)
      return matchesQuery && (!officeOnly || colleague.status === "La birou")
    })
  }, [query, officeOnly])

  function toggleFavorite(name: string) {
    setFavorites((current) => {
      const next = new Set(current)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    
    
    <section className="min-h-screen bg-[#f7f8fa] text-[#24312f]">
      <div className="h-[72px] border-b border-[#dde0e2] bg-[#e4e5e6]" aria-label="Header placeholder" />

      <div className="px-4 py-6 sm:px-6 sm:py-9 lg:px-12 lg:py-10">
        <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <label className="flex min-h-12 max-w-[690px] flex-1 items-center gap-2.5 rounded-[14px] border border-[#e7eaec] bg-white px-4 text-[#69736f] shadow-[0_1px_2px_rgba(24,39,35,0.03)] transition focus-within:border-[#0da879] focus-within:shadow-[0_0_0_3px_rgba(13,168,121,0.12)]">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută un coleg după nume"
              aria-label="Caută un coleg după nume"
              className="w-full border-0 bg-transparent text-sm text-[#26312e] outline-none placeholder:text-[#8a9390]"
            />
          </label>
          <button
            type="button"
            className={`min-h-[42px] self-end rounded-[13px] border bg-white px-[18px] text-sm font-semibold transition sm:self-auto ${officeOnly ? "border-[#0da879] text-[#087a59]" : "border-[#e4e7e8] text-[#4e5955] hover:border-[#0da879] hover:text-[#087a59]"}`}
            onClick={() => setOfficeOnly((active) => !active)}
            aria-pressed={officeOnly}
          >
            Filtru
          </button>
        </div>

        <div className="max-w-[920px] overflow-x-auto rounded-[20px] border border-[#e8ebec] bg-white shadow-[0_3px_5px_rgba(30,49,44,0.12)]">
          <table className="w-full min-w-[680px] table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="py-3 pt-[17px] pr-3 pb-3 pl-[22px] text-left text-xs font-semibold text-[#606a67]">Coleg</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[#606a67]">Status</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[#606a67]">Locație</th>
                <th scope="col" className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[#606a67]">Favorit</th>
                <th scope="col" className="py-3 pt-[17px] pr-[22px] pl-3 text-left text-xs font-semibold text-[#606a67]"><span className="sr-only">Profil</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleColleagues.map((colleague) => {
                const isFavorite = favorites.has(colleague.name)
                return (
                  <tr key={colleague.name} className="border-b border-[#eef0f1] last:border-0 hover:bg-[#f9fcfb]">
                    <td className="py-3 pr-3 pl-[22px] align-middle text-[13px]">
                      <div className="flex items-center gap-[13px]">
                        <span className="grid size-[30px] shrink-0 place-items-center rounded-full border-2 border-[#00a873] bg-[#d9fae8] text-[11px] font-bold text-[#087a59]" aria-hidden="true">{initials(colleague.name)}</span>
                        <div>
                          <div className="leading-[1.1] font-bold text-[#26312e]">{colleague.name}</div>
                          <div className="mt-[3px] text-[11px] leading-[1.1] text-[#5f6966]">{colleague.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle text-[13px]"><span className={`inline-flex min-w-[74px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${colleague.status === "La birou" ? "bg-[#d8fae9] text-[#0b9b6c]" : "bg-[#ffe4e6] text-[#ee737b]"}`}>{colleague.status}</span></td>
                    <td className="px-3 py-3 align-middle text-xs leading-[1.2] font-semibold text-[#47524e]">{colleague.location.map((line) => <span key={line} className="block">{line}</span>)}</td>
                    <td className="px-3 py-3 align-middle text-[13px]">
                      <button
                        type="button"
                        className={`p-1 leading-none transition ${isFavorite ? "text-[#f7a300]" : "text-[#d9dfe0] hover:text-[#f7a300]"}`}
                        onClick={() => toggleFavorite(colleague.name)}
                        aria-label={`${isFavorite ? "Elimină" : "Adaugă"} ${colleague.name} ${isFavorite ? "din" : "la"} favorite`}
                      >
                        <Star size={19} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
                      </button>
                    </td>
                    <td className="py-3 pr-[22px] pl-3 align-middle text-[13px]"><button type="button" className="whitespace-nowrap bg-transparent p-0 text-xs font-bold text-[#11a878] hover:text-[#087a59] hover:underline">Vezi profil</button></td>
                  </tr>
                )
              })}
              {visibleColleagues.length === 0 && (
                <tr><td className="px-6 py-[42px] text-center text-[#66716d]" colSpan={5}>Nu am găsit colegi care să corespundă căutării.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
