import { CalendarDays, Clock3, MapPin, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const profiles = {
  "ciupitu-claudiu": {
    name: "Claudiu Ciupițu", role: "Frontend Developer · Engineering", email: "claudiu.ciupitu@company.com", location: "Azi la: Loc W1 · Corp T1 · Etaj 1", floor: "Etaj 1", reservations: "4", start: "09:00", department: "Engineering",
  },
  "ruxandra-bituleanu": { name: "Ruxandra Bituleanu", role: "Product Designer · Product", email: "ruxandra.bituleanu@company.com", location: "Azi la: Stand-up Chat room · Corp T1", floor: "Etaj 1", reservations: "6", start: "09:30", department: "Product" },
  "denis-radoi": { name: "Denis Radoi", role: "Backend Engineer · Engineering", email: "denis.radoi@company.com", location: "Lucrează remote azi", floor: "Remote", reservations: "3", start: "09:00", department: "Engineering" },
  "ana-hirceanu": { name: "Ana Hirceanu", role: "Frontend Engineer · Engineering", email: "ana.hirceanu@company.com", location: "Azi la: 404 · Corp T2", floor: "Etaj 1", reservations: "5", start: "09:00", department: "Engineering" },
  "bunea-george": { name: "Bunea George", role: "QA · Engineering", email: "bunea.george@company.com", location: "Lucrează remote azi", floor: "Remote", reservations: "2", start: "09:00", department: "Engineering" },
}

const days = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]

export default function ColleagueProfilePage() {
  const { colleagueId } = useParams()
  const [colleague, setColleague] = useState<Colleague | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)

  useEffect(() => {
    const id = Number(colleagueId)
    if (!Number.isInteger(id)) { setLoading(false); return }
    getColleagues().then((colleagues) => setColleague(colleagues.find((item) => item.id === id) ?? null)).catch((error) => console.error("Nu s-a putut încărca profilul colegului:", error)).finally(() => setLoading(false))
  }, [colleagueId])

          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5">
            <h3 className="text-xs font-bold text-[var(--foreground)]">Rezervări recente</h3>
            <div className="mt-3 space-y-2">
              <Reservation date="Luni, 28 Iulie" place="Loc W1 · Corp T1 · Etaj 1" time="09:00 – 18:00" />
              <Reservation date="Joi, 25 Iulie" place="Loc W1 · Corp T1 · Etaj 1" time="09:00 – 17:30" />
              <Reservation date="Luni, 21 Iulie" place="Loc W3 · Corp T2 · Parter" time="10:00 – 18:00" />
            </div>
          </article>
        </div>

  const initials = colleague.initials || colleague.name.split(" ").map((part) => part[0]).join("").slice(0, 2)
  const location = colleague.status === "Remote" ? "Lucrează remote azi" : `Azi la: ${colleague.floor}`
  const department = colleague.department || "Engineering"

  return <section className="w-full max-w-[920px] text-[var(--foreground)]"><div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]"><div className="min-w-0 space-y-5"><article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]"><div className="h-11 bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)]" /><div className="px-4 pb-4 sm:px-5 sm:pb-5"><div className="-mt-5 flex flex-wrap items-start justify-between gap-3"><div className="grid size-12 place-items-center rounded-lg border-2 border-[var(--primary)] bg-[var(--secondary)] text-sm font-bold text-[var(--secondary-foreground)] shadow-sm">{initials}</div><button type="button" onClick={() => setInviteOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 text-[10px] font-bold text-[var(--primary-foreground)] transition hover:bg-[var(--sidebar-accent-hover)]"><Users size={13} />Invită la muncă</button></div><div className="mt-3 flex flex-wrap items-center gap-2"><h2 className="break-words text-base font-bold">{colleague.name}</h2>{colleague.isFavorite && <Star size={15} fill="currentColor" className="shrink-0 text-[var(--warning)]" />}</div><p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">{colleague.role} · {department}</p><p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)]"><MapPin size={13} />{location}</p></div></article><div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:grid-cols-4"><ProfileMetricCard icon={<CalendarDays size={14} />} value="—" label="Rezervări / săpt." color="bg-[var(--secondary)] text-[var(--secondary-foreground)]" /><ProfileMetricCard icon={<MapPin size={14} />} value={colleague.floor} label="Locație curentă" color="bg-[var(--secondary)] text-[var(--secondary-foreground)]" /><ProfileMetricCard icon={<Clock3 size={14} />} value={colleague.status === "Remote" ? "Remote" : "09:00"} label="Începe de obicei" color="bg-[var(--warning)] text-[var(--warning)]" /><ProfileMetricCard icon={<Users size={14} />} value={department} label="Departament" color="bg-[var(--secondary)] text-[var(--secondary-foreground)]" /></div><RecentReservations /></div><div className="space-y-5"><article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5"><h3 className="text-xs font-bold">Preferințe muncă</h3><p className="mt-3 text-xs text-[var(--muted-foreground)]">Preferințele colegului nu sunt disponibile momentan.</p></article><article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5"><h3 className="text-xs font-bold">Program obișnuit</h3><div className="mt-3 flex flex-wrap gap-1.5">{days.map((day, index) => <span key={day} className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${index < 5 ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>{day}</span>)}</div></article></div></div><InviteColleagueDialog colleagueName={colleague.name} open={inviteOpen} onClose={() => setInviteOpen(false)} /></section>
}

function RecentReservations() { return <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5"><h3 className="text-xs font-bold">Rezervări recente</h3><p className="mt-3 text-xs text-[var(--muted-foreground)]">Istoricul rezervărilor nu este disponibil momentan.</p></article> }
