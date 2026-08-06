import type { ReactElement } from "react"
import { Calendar, Clock, Repeat, ArrowLeft } from "lucide-react"
import type { Seat, RecurrenceType } from "@/types"

interface SeatSummaryCardProps {
  selectedSeat: Seat | null
  buildingName: string
  floorName: string
  selectedDate: Date | null
  startTime: string
  endTime: string
  recurrence: RecurrenceType
  onConfirm: () => void
  onEditSchedule?: () => void
  isSubmitting?: boolean
  className?: string
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
  className = "",
}: SeatSummaryCardProps): ReactElement {
  // Format Romanian date: e.g. "29 iulie 2026"
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "29 iulie 2026"

  // Format 12h/24h time display: e.g. "9:00 AM — 10:00 AM"
  const formattedTimeRange = `${formatTo12H(startTime)} — ${formatTo12H(endTime)}`
  const durationLabel = calculateDuration(startTime, endTime)

  const recurrenceLabel =
    recurrence === "lunar"
      ? "Lunar"
      : recurrence === "saptamanal"
      ? "Săptămânal"
      : recurrence === "zilnic"
      ? "Zilnic"
      : "Niciuna"

  return (
    <div
      className={`bg-[var(--card)] rounded-2xl p-6 sm:p-7 border border-[var(--border)] shadow-xs flex flex-col justify-between transition-all ${className}`}
    >
      <div>
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-[22px] font-bold text-[var(--foreground)] tracking-tight">
            {selectedSeat ? (
              <span>
                Loc {selectedSeat.code}{" "}
                <span className="font-semibold text-[var(--muted-foreground)]">
                  {buildingName} {floorName}
                </span>
              </span>
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
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Date
              </div>
              <div className="text-sm font-semibold text-[var(--foreground)] mt-0.5 capitalize">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Time row */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Time
              </div>
              <div className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                {formattedTimeRange}
              </div>
              {durationLabel && (
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {durationLabel}
                </div>
              )}
            </div>
          </div>

          {/* Recurrence row */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Repeat size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Recurenta
              </div>
              <div className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                {recurrenceLabel}
              </div>
            </div>
          </div>
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

function formatTo12H(timeStr: string) {
  if (!timeStr) return "9:00 AM"
  const [hh, mm] = timeStr.split(":").map(Number)
  const period = hh >= 12 ? "PM" : "AM"
  const hours12 = hh % 12 === 0 ? 12 : hh % 12
  const minsStr = (mm ?? 0).toString().padStart(2, "0")
  return `${hours12}:${minsStr} ${period}`
}

function calculateDuration(startTime: string, endTime: string) {
  if (!startTime || !endTime) return "1 hr"
  const [sh, sm] = startTime.split(":").map(Number)
  const [eh, em] = endTime.split(":").map(Number)
  const startMins = sh * 60 + sm
  const endMins = eh * 60 + em
  const diff = Math.max(0, endMins - startMins)
  const hrs = Math.floor(diff / 60)
  const mins = diff % 60
  if (hrs && mins) return `${hrs} hr ${mins} min`
  if (hrs === 1) return `1 hr`
  if (hrs > 1) return `${hrs} hrs`
  return `${mins} min`
}
