import { CalendarDays, Clock3, MapPin, Star, Users } from "lucide-react"
import { useParams } from "react-router-dom"

const profiles = {
  "ciupitu-claudiu": {
    name: "Claudiu Ciupițu", role: "Frontend Developer · Engineering", email: "claudiu.ciupitu@company.com", location: "Azi la: Loc 7 · Corp A · Etaj 1", floor: "Etaj 1", reservations: "4", start: "09:00", department: "Engineering",
  },
  "ruxandra-bituleanu": { name: "Ruxandra Bituleanu", role: "Product Designer · Product", email: "ruxandra.bituleanu@company.com", location: "Azi la: Stand-up Chat room · T1", floor: "Etaj 1", reservations: "6", start: "09:30", department: "Product" },
  "denis-radoi": { name: "Denis Radoi", role: "Backend Engineer · Engineering", email: "denis.radoi@company.com", location: "Lucrează remote azi", floor: "Remote", reservations: "3", start: "09:00", department: "Engineering" },
  "ana-hirceanu": { name: "Ana Hirceanu", role: "Frontend Engineer · Engineering", email: "ana.hirceanu@company.com", location: "Azi la: Loc 404 · T2", floor: "Etaj 2", reservations: "5", start: "09:00", department: "Engineering" },
  "bunea-george": { name: "Bunea George", role: "QA · Engineering", email: "bunea.george@company.com", location: "Lucrează remote azi", floor: "Remote", reservations: "2", start: "09:00", department: "Engineering" },
}

const days = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]

export default function ColleagueProfilePage() {
  const { colleagueId } = useParams()
  const colleague = profiles[colleagueId as keyof typeof profiles] ?? profiles["ciupitu-claudiu"]
  const initials = colleague.name.split(" ").map((part) => part[0]).join("").slice(0, 2)

  return (
    <section className="w-full max-w-[920px] text-[#1f2937]">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        <div className="min-w-0 space-y-5">
          <article className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="h-11 bg-gradient-to-r from-[#d1fae5] to-[#f3f4f6]" />
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="-mt-5 flex flex-wrap items-start justify-between gap-3">
                <div className="grid size-12 place-items-center rounded-lg border-2 border-[#059669] bg-[#d1fae5] text-sm font-bold text-[#059669] shadow-sm">{initials}</div>
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#059669] px-3 text-[10px] font-bold text-white transition hover:bg-[#047857]"><Users size={13} />Invită la muncă</button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h2 className="break-words text-base font-bold text-[#1f2937]">{colleague.name}</h2>
                <Star size={15} fill="#f59e0b" className="shrink-0 text-[#f59e0b]" />
              </div>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{colleague.role}</p>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{colleague.email}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669]"><MapPin size={13} />{colleague.location}</p>
              <p className="mt-0.5 text-[10px] text-[#6b7280]">Preferă Etaj 1, lângă fereastră</p>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:grid-cols-4">
            <Metric icon={<CalendarDays size={14} />} value={colleague.reservations} label="Rezervări / săpt." color="bg-[#d1fae5] text-[#059669]" />
            <Metric icon={<MapPin size={14} />} value={colleague.floor} label="Floor preferat" color="bg-[#d1fae5] text-[#059669]" />
            <Metric icon={<Clock3 size={14} />} value={colleague.start} label="Începe de obicei" color="bg-[#fef3c7] text-[#f59e0b]" />
            <Metric icon={<Users size={14} />} value={colleague.department} label="Departament" color="bg-[#d1fae5] text-[#059669]" />
          </div>

          <article className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5">
            <h3 className="text-xs font-bold text-[#1f2937]">Rezervări recente</h3>
            <div className="mt-3 space-y-2">
              <Reservation date="Luni, 28 Iulie" place="Loc 7 · Corp A · Etaj 1" time="09:00 – 18:00" />
              <Reservation date="Joi, 25 Iulie" place="Loc 7 · Corp A · Etaj 1" time="09:00 – 17:30" />
              <Reservation date="Luni, 21 Iulie" place="Loc 12 · Corp B · Parter" time="10:00 – 18:00" />
            </div>
          </article>
        </div>

        <div className="space-y-5">
          <article className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5">
            <h3 className="text-xs font-bold text-[#1f2937]">Preferințe muncă</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Lângă fereastră", "Zone liniștite", "Aproape de colegi"].map((item) => (
                <span key={item} className="rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-2.5 py-1 text-[10px] text-[#1f2937]">
                  {item}
                </span>
              ))}
            </div>
          </article>
          <article className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-5">
            <h3 className="text-xs font-bold text-[#1f2937]">Program obișnuit</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {days.map((day, index) => (
                <span key={day} className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${index < 5 ? "bg-[#059669] text-white" : "bg-[#f3f4f6] text-[#6b7280]"}`}>
                  {day}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#6b7280]">Vine la birou în fiecare zi lucrătoare</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function Metric({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <article className="min-w-0 rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <span className={`grid size-6 place-items-center rounded-md ${color}`}>{icon}</span>
      <p className="mt-2 truncate text-xs font-bold text-[#1f2937]">{value}</p>
      <p className="mt-0.5 truncate text-[9px] text-[#6b7280]">{label}</p>
    </article>
  )
}

function Reservation({ date, place, time }: { date: string; place: string; time: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#e5e7eb] px-2.5 py-2 sm:flex-nowrap">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#d1fae5] text-[#059669]">
        <CalendarDays size={13} />
      </span>
      <div className="min-w-[120px] flex-1">
        <p className="text-[10px] font-bold text-[#1f2937]">{date}</p>
        <p className="truncate text-[9px] text-[#6b7280]">{place}</p>
      </div>
      <span className="ml-8 text-[9px] text-[#6b7280] sm:ml-0 sm:shrink-0">{time}</span>
    </div>
  )
}
