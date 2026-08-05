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
    <Card className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <h2 className="text-[15px] font-bold text-[#1f2937]">Rezervările mele</h2>
        <button
          onClick={onNavigateToSeats}
          className="flex items-center gap-0.5 border-0 bg-transparent text-[13px] font-semibold text-[#059669] cursor-pointer p-0 transition hover:text-[#047857]"
        >
          Vezi toate <ChevronRight size={14} />
        </button>
      </CardHeader>
      <CardContent>
        {upcomingReservations.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-5 text-[13px] text-[#6b7280]">
            <CalendarCheck size={18} className="text-[#059669]" />
            <span>Nu ai rezervări viitoare</span>
            <Button
              onClick={onNavigateToSeats}
              className="rounded-full bg-[#059669] hover:bg-[#047857] text-white gap-1.5 shadow-sm"
            >
              <CalendarCheck size={15} /> Rezervă acum
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {upcomingReservations.map((reservation) => {
              const accentColor =
                reservation.status === "confirmed"
                  ? "#059669"
                  : reservation.status === "pending"
                  ? "#f59e0b"
                  : "#10b981"

              const reservationDate = new Date(`${reservation.date}T12:00:00`)

              return (
                <div
                  key={reservation.id}
                  className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f3f4f6] px-3.5 py-3 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <div
                    className="w-[3px] h-9 rounded-[2px] flex-shrink-0"
                    style={{ background: accentColor }}
                  />
                  <div className="flex flex-col items-center w-9 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">
                      {MONTH_LABELS[reservationDate.getMonth()]}
                    </span>
                    <span className="text-xl font-extrabold leading-none text-[#1f2937]">
                      {reservationDate.getDate()}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="truncate text-sm font-semibold text-[#1f2937]">
                      {reservation.floor?.name ?? "—"} · Loc {reservation.seat?.code ?? "—"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#6b7280]">
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
