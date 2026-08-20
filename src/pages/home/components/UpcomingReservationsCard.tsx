import { useState, useCallback, useEffect } from "react"
import { CalendarCheck, Clock, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui"
import { StatusBadge } from "./StatusBadge"
import { EditReservationModal } from "./EditReservationModal"
import { MONTH_LABELS } from "@/utils"
import type { DetailedReservation } from "@/types"

interface UpcomingReservationsCardProps {
  reservations: DetailedReservation[]
  onNavigateToSeats: () => void
}

export function UpcomingReservationsCard({
  reservations,
  onNavigateToSeats,
}: UpcomingReservationsCardProps) {
  const [localReservations, setLocalReservations] = useState<DetailedReservation[]>([])
  const [editingReservation, setEditingReservation] = useState<DetailedReservation | null>(null)

  // Sync from parent when reservations load/change
  useEffect(() => {
    setLocalReservations(reservations)
  }, [reservations])

  const userReservations = [...localReservations]
    .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))

  const handleSaved = useCallback((updated: DetailedReservation) => {
    setLocalReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    )
  }, [])

  const handleCancelled = useCallback((reservationId: number) => {
    setLocalReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: "cancelled" } : r
      )
    )
  }, [])

  return (
    <>
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <h2 className="text-[15px] font-bold text-[var(--foreground)]">Rezervările mele</h2>
          <span className="text-[12px] text-[var(--muted-foreground)] font-medium">
            {userReservations.length} rezervări
          </span>
        </CardHeader>
        <CardContent>
          {userReservations.length === 0 ? (
            <div className="flex flex-col items-center gap-2.5 py-5 text-[13px] text-[var(--muted-foreground)]">
              <CalendarCheck size={18} className="text-[var(--primary)]" />
              <span>Nu ai rezervări viitoare</span>
              <Button
                onClick={onNavigateToSeats}
                leftIcon={<CalendarCheck size={15} />}
                className="rounded-full bg-[var(--primary)] hover:bg-[var(--sidebar-accent-hover)] text-[var(--primary-foreground)]"
              >
                Rezervă acum
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {userReservations.map((reservation) => {
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-3.5 sm:px-3.5 sm:py-3 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
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
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                          {reservation.floor?.name ?? "—"} · {reservation.seat?.code?.startsWith("Sala ") ? reservation.seat.code : `Loc ${reservation.seat?.code ?? "—"}`}
                        </span>
                        <span className="flex flex-wrap items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Clock size={12} className="shrink-0" />
                          {reservation.startTime}–{reservation.endTime}
                          {reservation.location && <span className="truncate"> · {reservation.location.name}</span>}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 border-t border-[var(--border)]/60 sm:border-t-0 sm:pt-0 shrink-0">
                      <StatusBadge status={reservation.status} />
                      <Button
                        id={`edit-reservation-${reservation.id}`}
                        variant="outline"
                        size="xs"
                        onClick={() => setEditingReservation(reservation)}
                        leftIcon={<Pencil size={12} />}
                        className="text-[12px] font-semibold text-[var(--primary)] shrink-0"
                        title="Editează rezervarea"
                      >
                        Editează
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <EditReservationModal
        reservation={editingReservation}
        onClose={() => setEditingReservation(null)}
        onSaved={handleSaved}
        onCancelled={handleCancelled}
      />
    </>
  )
}
