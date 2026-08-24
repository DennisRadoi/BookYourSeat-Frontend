import { CalendarDays, Clock3, MapPin, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { InviteColleagueDialog } from "./components/InviteColleagueDialog"
import { ProfileMetricCard } from "./components/ProfileMetricCard"
import { InfoCard } from "@/components/common"
import { Button } from "@/components/ui"
import { getColleagueProfile, type ColleagueProfile } from "@/services"

const days = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]

function lastWeekBookings(profile: ColleagueProfile) {
  const today = new Date()
  const day = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - day - 7)
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  return profile.bookingDto.filter((booking) => {
    const date = new Date(`${booking.dateOfBooking}T00:00:00`)
    return date >= monday && date <= sunday
  }).length
}

export default function ColleagueProfilePage() {
  const { colleagueId } = useParams()
  const [profile, setProfile] = useState<ColleagueProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const id = Number(colleagueId)
    if (!Number.isInteger(id)) { setLoading(false); return }
    setLoadError(null)
    getColleagueProfile(id)
      .then(setProfile)
      .catch((error) => {
        console.error("Nu s-a putut încărca profilul colegului:", error)
        setLoadError(error instanceof Error ? error.message : "Profilul nu a putut fi încărcat.")
      })
      .finally(() => setLoading(false))
  }, [colleagueId])

  if (loading) return <div className="grid min-h-[280px] place-items-center text-sm text-[var(--muted-foreground)]">Se încarcă profilul colegului…</div>
  if (loadError) return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--destructive)]">{loadError}</div>
  if (!profile || !colleagueId) return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">Colegul căutat nu a fost găsit.</div>

  const initials = profile.fullname.split(" ").map((part) => part[0]).join("").slice(0, 2)
  const preferredDays = new Set((profile.daysOfWeek || "").split(",").map((day) => Number(day.trim())).filter(Boolean))
  const preferences = [profile.nearWindow && "Lângă fereastră", profile.quietPlace && "Loc liniștit"].filter(Boolean) as string[]
  const bookingsLastWeek = lastWeekBookings(profile)

  return <section className="w-full max-w-[920px] text-[var(--foreground)]"><div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]"><div className="min-w-0 space-y-5"><article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]"><div className="h-11 bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)]" /><div className="px-4 pb-4 sm:px-5 sm:pb-5"><div className="-mt-5 flex flex-wrap items-start justify-between gap-3"><div className="grid size-12 place-items-center rounded-lg border-2 border-[var(--primary)] bg-[var(--secondary)] text-sm font-bold">{initials}</div><Button type="button" size="xs" onClick={() => setInviteOpen(true)} leftIcon={<Users size={13} />} className="font-bold">Invită la muncă</Button></div><div className="mt-3 flex flex-wrap items-center gap-2"><h2 className="break-words text-base font-bold">{profile.fullname}</h2>{profile.isFavorite && <Star size={15} fill="currentColor" className="text-[var(--warning)]" />}</div><p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">{profile.role || "—"}{profile.departmentName ? ` · ${profile.departmentName}` : ""}</p><p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)]"><MapPin size={13} />{profile.location || "Lucrează remote azi"}</p></div></article><div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-3"><ProfileMetricCard icon={<CalendarDays size={14} />} value={String(bookingsLastWeek)} label="Rezervări săptămâna trecută" color="bg-[var(--secondary)] text-[var(--secondary-foreground)]" /><ProfileMetricCard icon={<MapPin size={14} />} value={profile.location || "Remote"} label="Locație curentă" color="bg-[var(--secondary)] text-[var(--secondary-foreground)]" /><ProfileMetricCard icon={<Clock3 size={14} />} value={profile.preferredStartTime?.slice(0, 5) || "—"} label="Începe de obicei" color="bg-[var(--warning)] text-[var(--warning)]" /></div></div><div className="space-y-5"><InfoCard title="Preferințe muncă">{preferences.length ? <div className="mt-3 flex flex-wrap gap-2">{preferences.map((preference) => <span key={preference} className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs font-semibold">{preference}</span>)}</div> : <p className="mt-3 text-xs text-[var(--muted-foreground)]">Nu are preferințe setate.</p>}</InfoCard><InfoCard title="Program obișnuit"><div className="mt-3 flex flex-wrap gap-1.5">{days.map((day, index) => <span key={day} className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${preferredDays.has(index + 1) ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>{day}</span>)}</div></InfoCard></div></div><InviteColleagueDialog colleagueId={Number(colleagueId)} colleagueName={profile.fullname} open={inviteOpen} onClose={() => setInviteOpen(false)} /></section>
}
