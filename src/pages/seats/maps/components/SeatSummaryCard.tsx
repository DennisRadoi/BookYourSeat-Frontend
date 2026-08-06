import type { ReactElement } from "react"
import { Calendar, Clock, Repeat, ArrowLeft } from "lucide-react"
import { MetricIconTile } from "@/components/common"
import type { Seat, RecurrenceType } from "@/types"

interface SeatSummaryCardProps {
  selectedSeat: Seat | null
  buildingName?: string
  floorName?: string
  selectedDate: Date | null
  startTime: string
  endTime: string
  recurrence: RecurrenceType
  onConfirm: () => void
  onEditSchedule?: () => void
  isSubmitting?: boolean
}

export function SeatSummaryCard({
  selectedSeat,
  buildingName,
  floorName,
  selectedDate,
  startTime,
  endTime,
  recurrence,
  onConfirm,
  onEditSchedule,
  isSubmitting = false,
}: SeatSummaryCardProps): ReactElement {
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("ro-RO", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "Nedefinit"

  const formattedTimeRange = `${startTime} - ${endTime}`
  const durationLabel = calculateDuration(startTime, endTime)

  const recurrenceLabel =
    recurrence === "niciuna"
      ? "Fără recurență"
      : recurrence === "zilnic"
      ? "Zilnic"
      : recurrence === "saptamanal"
      ? "Săptămânal"
      : "Lunar"

  return (
    <div className="bg-[var(--card)] rounded-3xl p-6 sm:p-7 border border-[var(--border)] shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Card Title */}
        <div className="border-b border-[var(--border)] pb-5 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
            {buildingName && floorName ? `${buildingName} · ${floorName}` : "Rezumat rezervare"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            {selectedSeat ? (
              <span>Locul {selectedSeat.code}</span>
            ) : (
              <span className="text-base sm:text-lg text-[var(--muted-foreground)] font-normal">
                Selectează un loc din sală
              </span>
            )}
          </h2>
        </div>

        {/* Detail Rows */}
        <div className="space-y-5">
          {/* Date row */}
          <MetricIconTile
            icon={<Calendar size={20} />}
            subtitle={<span className="uppercase tracking-wider font-medium">Date</span>}
            title={<span className="capitalize">{formattedDate}</span>}
          />

          {/* Time row */}
          <MetricIconTile
            icon={<Clock size={20} />}
            subtitle={<span className="uppercase tracking-wider font-medium">Time</span>}
            title={
              <div>
                <div>{formattedTimeRange}</div>
                {durationLabel && <div className="text-xs text-[var(--muted-foreground)] font-normal">{durationLabel}</div>}
              </div>
            }
          />

          {/* Recurrence row */}
          <MetricIconTile
            icon={<Repeat size={20} />}
            subtitle={<span className="uppercase tracking-wider font-medium">Recurenta</span>}
            title={recurrenceLabel}
          />
        </div>
      </div>

      {/* Action CTA & Edit link */}
      <div className="mt-8 space-y-3">
        <button
          type="button"
          id="confirm-reservation-btn"
          onClick={onConfirm}
          disabled={!selectedSeat || isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-bold shadow-sm hover:bg-[var(--sidebar-accent-hover)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Se confirmă...</span>
          ) : (
            <span>Confirma rezervarea</span>
          )}
        </button>

        {onEditSchedule && (
          <button
            type="button"
            onClick={onEditSchedule}
            className="w-full text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-1.5 py-1 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Modifică data sau intervalul</span>
          </button>
        )}
      </div>
    </div>
  )
}

function calculateDuration(start: string, end: string): string | null {
  const [startH, startM] = start.split(":").map(Number)
  const [endH, endM] = end.split(":").map(Number)

  if (isNaN(startH) || isNaN(endH)) return null

  const startTotalMinutes = startH * 60 + startM
  const endTotalMinutes = endH * 60 + endM

  const diffMinutes = endTotalMinutes - startTotalMinutes
  if (diffMinutes <= 0) return null

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours} ore`
  } else {
    return `${minutes} minute`
  }
}
