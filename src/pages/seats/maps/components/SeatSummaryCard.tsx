import type { ReactElement } from "react"
import { Calendar, Clock, Repeat, ArrowLeft } from "lucide-react"
import { MetricIconTile } from "@/components/common"
import type { Seat, RecurrenceType } from "@/types"
import { Button } from "@/components/ui"

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
        <Button
          type="button"
          id="confirm-reservation-btn"
          onClick={onConfirm}
          disabled={!selectedSeat}
          isLoading={isSubmitting}
          className="w-full py-3.5 h-auto text-sm font-bold rounded-xl active:scale-[0.99] transition-all"
        >
          Confirma rezervarea
        </Button>

        {onEditSchedule && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onEditSchedule}
            leftIcon={<ArrowLeft size={13} />}
            className="w-full text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)]"
          >
            Modifică data sau intervalul
          </Button>
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
