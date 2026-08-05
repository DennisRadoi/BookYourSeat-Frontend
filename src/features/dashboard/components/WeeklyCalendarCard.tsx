import { MapPin, Clock, CalendarCheck } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { cn, formatDateIso, getWeekDays, DAY_LABELS_SHORT, DAY_LABELS_FULL, MONTH_LABELS } from "@/utils"
import type { DetailedReservation } from "@/types"

interface WeeklyCalendarCardProps {
  selectedDate: string
  onSelectDate: (date: string) => void
  reservations: DetailedReservation[]
  onNavigateToSeats: () => void
}

export function WeeklyCalendarCard({
  selectedDate,
  onSelectDate,
  reservations,
  onNavigateToSeats,
}: WeeklyCalendarCardProps) {
  const today = new Date()
  const todayIso = formatDateIso(today)
  const weekDays = getWeekDays(today)

  const selectedDayReservations = reservations.filter((r) => r.date === selectedDate)
  const selectedDateObject = new Date(`${selectedDate}T12:00:00`)
  const selectedDayName = DAY_LABELS_FULL[selectedDateObject.getDay()]

  return (
    <Card className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <h2 className="text-[15px] font-bold text-[var(--foreground)]">Rezervări viitoare</h2>
        <span className="text-[13px] text-[var(--muted-foreground)] font-medium">
          {MONTH_LABELS[today.getMonth()]} {today.getFullYear()}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-5 gap-2">
          {weekDays.map((day) => {
            const dayIso = formatDateIso(day)
            const isToday = dayIso === todayIso
            const isSelected = dayIso === selectedDate
            const hasReservationDot = reservations.some((r) => r.date === dayIso && r.status !== "cancelled")

            return (
              <button
                key={dayIso}
                onClick={() => onSelectDate(dayIso)}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-xl border-[1.5px] px-2 py-3 pb-2.5 cursor-pointer transition",
                  isToday
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--sidebar-accent-hover)]"
                    : isSelected
                    ? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)] font-bold"
                    : "border-[var(--day-border)] bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--secondary)] hover:border-[var(--primary)]",
                )}
              >
                <span className={cn("text-[11px] font-bold uppercase tracking-[0.5px] opacity-75", isToday && "opacity-90 text-[var(--primary-foreground)]")}>
                  {DAY_LABELS_SHORT[day.getDay()]}
                </span>
                <span className="text-xl font-extrabold leading-none">{day.getDate()}</span>
                {hasReservationDot && (
                  <span className={cn("absolute bottom-1.5 h-1.5 w-1.5 rounded-full", isToday ? "bg-[var(--primary-foreground)]" : "bg-[var(--success)]")} />
                )}
              </button>
            )
          })}
        </div>

        {selectedDayReservations.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-5 text-[13px] text-[var(--muted-foreground)]">
            <MapPin size={18} className="text-[var(--primary)]" />
            <span>Nicio rezervare pentru {selectedDayName}</span>
            <Button
              onClick={onNavigateToSeats}
              className="rounded-full bg-[var(--primary)] hover:bg-[var(--sidebar-accent-hover)] text-[var(--primary-foreground)] gap-1.5 shadow-sm"
            >
              <CalendarCheck size={15} /> Rezervă un loc
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {selectedDayReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-3 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="flex flex-col items-center w-9 flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[var(--muted-foreground)]">
                    {MONTH_LABELS[selectedDateObject.getMonth()]}
                  </span>
                  <span className="text-xl font-extrabold leading-none text-[var(--foreground)]">
                    {selectedDateObject.getDate()}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {reservation.seat?.code ?? "—"} · {reservation.floor?.name ?? "—"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Clock size={12} />
                    {reservation.startTime}–{reservation.endTime}
                  </span>
                </div>
                <StatusBadge status={reservation.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
