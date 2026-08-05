import { CalendarCheck, ChevronRight, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { formatDateIso, MONTH_LABELS } from "@/utils"
import type { DetailedReservation } from "@/types"

interface UpcomingReservationsCardProps {
  reservations: DetailedReservation[]
  onNavigateToSeats: () => void
}

export function UpcomingReservationsCard({
  reservations,
  onNavigateToSeats,
}: UpcomingReservationsCardProps) {
  const todayIso = formatDateIso(new Date())

  const upcomingReservations = reservations
    .filter((r) => r.date >= todayIso && r.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <Card className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <h2 className="text-[15px] font-bold text-[var(--foreground)]">Rezervările mele</h2>
        <button
          onClick={onNavigateToSeats}
          className="flex items-center gap-0.5 border-0 bg-transparent text-[13px] font-semibold text-[var(--primary)] cursor-pointer p-0 transition hover:text-[var(--sidebar-accent-hover)]"
        >
          Vezi toate <ChevronRight size={14} />
        </button>
      </CardHeader>
      <CardContent>
        {upcomingReservations.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-5 text-[13px] text-[var(--muted-foreground)]">
            <CalendarCheck size={18} className="text-[var(--primary)]" />
            <span>Nu ai rezervări viitoare</span>
            <Button
              onClick={onNavigateToSeats}
              className="rounded-full bg-[var(--primary)] hover:bg-[var(--sidebar-accent-hover)] text-[var(--primary-foreground)] gap-1.5 shadow-sm"
            >
              <CalendarCheck size={15} /> Rezervă acum
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {upcomingReservations.map((reservation) => {
              const accentColor =
                reservation.status === "confirmed"
                  ? "var(--primary)"
                  : reservation.status === "pending"
                  ? "var(--warning)"
                  : "var(--success)"

              const reservationDate = new Date(`${reservation.date}T12:00:00`)

              return (
                <div
                  key={reservation.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-3 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <div
                    className="w-[3px] h-9 rounded-[2px] flex-shrink-0"
                    style={{ background: accentColor }}
                  />
                  <div className="flex flex-col items-center w-9 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[var(--muted-foreground)]">
                      {MONTH_LABELS[reservationDate.getMonth()]}
                    </span>
                    <span className="text-xl font-extrabold leading-none text-[var(--foreground)]">
                      {reservationDate.getDate()}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {reservation.floor?.name ?? "—"} · Loc {reservation.seat?.code ?? "—"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                      <Clock size={12} />
                      {reservation.startTime}–{reservation.endTime}
                      {reservation.location && <> · {reservation.location.name}</>}
                    </span>
                  </div>
                  <StatusBadge status={reservation.status} />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
