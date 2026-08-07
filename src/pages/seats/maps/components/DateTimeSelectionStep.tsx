import { useMemo, useState, useRef, useEffect, type ReactElement } from "react"
import { Calendar, Clock, Repeat, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { RecurrenceType } from "@/types"
import { Button, IconButton, PillButton } from "@/components/ui"
import TimeSlotList from "./TimeSlotList"

interface DateTimeSelectionStepProps {
  selectedDate: Date | null
  onSelectDate: (d: Date | null) => void
  startTime: string
  onStartTimeChange: (t: string) => void
  endTime: string
  onEndTimeChange: (t: string) => void
  recurrence: RecurrenceType
  onRecurrenceChange: (r: RecurrenceType) => void
  repeatEvery: number
  onRepeatEveryChange: (n: number) => void
  endsMode: "niciodata" | "la_data" | "dupa"
  onEndsModeChange: (m: "niciodata" | "la_data" | "dupa") => void
  endsOnDate: string
  onEndsOnDateChange: (d: string) => void
  endsAfterCount: number
  onEndsAfterCountChange: (c: number) => void
  onConfirmSchedule: () => void
}

export function DateTimeSelectionStep({
  selectedDate,
  onSelectDate,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  recurrence,
  onRecurrenceChange,
  repeatEvery,
  onRepeatEveryChange,
  endsMode,
  onEndsModeChange,
  endsOnDate,
  onEndsOnDateChange,
  endsAfterCount,
  onEndsAfterCountChange,
  onConfirmSchedule,
}: DateTimeSelectionStepProps): ReactElement {
  const [monthOffset, setMonthOffset] = useState(0)
  const endListRef = useRef<HTMLDivElement | null>(null)

  // scroll end list when endTime changes
  useEffect(() => {
    if (!endListRef.current) return
    try {
      const el = endListRef.current.querySelector(`[data-timeslot="${endTime}"]`) as HTMLElement | null
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" })
    } catch (e) {
      // ignore
    }
  }, [endTime])

  // Build time slots from 08:00 to 20:00
  const timeSlots = useMemo(() => {
    const list: string[] = []
    for (let h = 8; h <= 20; h++) {
      list.push(pad(h) + ":00")
      // Add half hour slots for every hour except the last (20:00)
      if (h < 20) list.push(pad(h) + ":30")
    }
    return list
  }, [])

  // Calendar calculations
  const calendar = useMemo(() => {
    const now = new Date()
    const display = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const month = display.getMonth()
    const year = display.getFullYear()

    const firstDay = new Date(year, month, 1).getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: (Date | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)

    return { display, cells }
  }, [monthOffset])

  const monthLabel = useMemo(() => {
    return calendar.display.toLocaleString("ro-RO", { month: "long", year: "numeric" })
  }, [calendar])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
      {/* Left Column: Calendar & Recurrence */}
      <div className="lg:col-span-7 col-span-1 space-y-6">
        {/* Calendar Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-xs p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--card-foreground)] font-semibold text-base">Selectează date</h3>
            <span className="text-xs text-[var(--muted-foreground)]">Apasă o dată pentru a selecta</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IconButton
                type="button"
                size="xs"
                variant="outline"
                disabled={monthOffset <= 0}
                onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
                className="w-8 h-8 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Luna precedentă"
              >
                <ChevronLeft size={16} />
              </IconButton>
              <div className="font-semibold text-[var(--card-foreground)] capitalize min-w-32 text-center text-sm">
                {monthLabel}
              </div>
              <IconButton
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setMonthOffset((m) => m + 1)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
                aria-label="Luna următoare"
              >
                <ChevronRight size={16} />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-sm">
            {["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"].map((d) => (
              <div key={d} className="text-[var(--muted-foreground)] text-center font-medium py-1 text-xs">
                {d}
              </div>
            ))}

            {calendar.cells.map((cell, idx) => {
              const isSelected = cell && selectedDate && isSameDay(cell, selectedDate)
              const isToday = cell && isSameDay(cell, new Date())
              const isPast = cell ? isBeforeToday(cell) : false

              return (
                <Button
                  key={idx}
                  type="button"
                  onClick={() => cell && !isPast && onSelectDate(cell)}
                  disabled={!cell || isPast}
                  variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                  className={`h-10 p-0 rounded-lg flex items-center justify-center text-sm transition-all duration-150 select-none ${
                    !cell
                      ? "opacity-0 cursor-default"
                      : isPast
                        ? "opacity-30 cursor-not-allowed text-[var(--muted-foreground)] line-through bg-[var(--muted)]/20"
                        : isSelected
                          ? "font-bold shadow-xs scale-105"
                          : isToday
                            ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
                            : ""
                  }`}
                >
                  {cell ? cell.getDate() : ""}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Recurrence Panel */}
        <div className="bg-[var(--card)] rounded-2xl shadow-xs p-6 border border-[var(--border)]">
          <h4 className="font-semibold text-base text-[var(--card-foreground)] mb-3">Recurență</h4>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {(["niciuna", "zilnic", "saptamanal", "lunar"] as RecurrenceType[]).map((r) => (
              <PillButton
                key={r}
                type="button"
                size="xs"
                isActive={recurrence === r}
                onClick={() => onRecurrenceChange(r)}
                className="px-4 py-1.5 text-xs font-semibold"
              >
                {r === "niciuna" ? "Niciuna" : r === "zilnic" ? "Zilnic" : r === "saptamanal" ? "Săptămânal" : "Lunar"}
              </PillButton>
            ))}
          </div>

          {recurrence !== "niciuna" && (
            <div className="border-t border-[var(--border)] pt-4 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <label className="text-xs text-[var(--muted-foreground)] font-medium">La fiecare</label>
                <input
                  type="number"
                  min={1}
                  value={repeatEvery}
                  onChange={(e) => onRepeatEveryChange(Math.max(1, Number(e.target.value || 1)))}
                  className="w-16 p-1.5 text-center rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--card-foreground)]"
                />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">
                  {recurrence === "zilnic" ? "zi(le)" : recurrence === "saptamanal" ? "săptămână(i)" : "lună(i)"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="ends"
                    checked={endsMode === "niciodata"}
                    onChange={() => onEndsModeChange("niciodata")}
                    className="accent-[var(--primary)] w-4 h-4"
                  />
                  <span className={endsMode === "niciodata" ? "text-[var(--primary)] font-medium" : "text-[var(--card-foreground)]"}>
                    Niciodată
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="ends"
                    checked={endsMode === "la_data"}
                    onChange={() => onEndsModeChange("la_data")}
                    className="accent-[var(--primary)] w-4 h-4"
                  />
                  <span className={endsMode === "la_data" ? "text-[var(--primary)] font-medium" : "text-[var(--card-foreground)]"}>
                    La data
                  </span>
                  <input
                    type="date"
                    value={endsOnDate}
                    onChange={(e) => onEndsOnDateChange(e.target.value)}
                    disabled={endsMode !== "la_data"}
                    className="ml-2 p-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--card-foreground)] disabled:opacity-50"
                  />
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="ends"
                    checked={endsMode === "dupa"}
                    onChange={() => onEndsModeChange("dupa")}
                    className="accent-[var(--primary)] w-4 h-4"
                  />
                  <span className={endsMode === "dupa" ? "text-[var(--primary)] font-medium" : "text-[var(--card-foreground)]"}>
                    După
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={endsAfterCount}
                    onChange={(e) => onEndsAfterCountChange(Math.max(1, Number(e.target.value || 1)))}
                    disabled={endsMode !== "dupa"}
                    className="ml-2 w-16 p-1.5 text-center rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--card-foreground)] disabled:opacity-50"
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">repetări</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Time Interval & Summary */}
      <div className="lg:col-span-5 col-span-1 space-y-6">
        {/* Time Interval Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-xs p-6 border border-[var(--border)]">
          <h4 className="font-semibold text-base text-[var(--card-foreground)] mb-4">Interval orar</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
              <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wide">
                Ora început
              </div>
              <TimeSlotList
                slots={timeSlots}
                selected={startTime}
                onSelect={(t) => {
                  const tMin = timeToMinutes(t)
                  const maxMin = 20 * 60
                  const disableStart = tMin > maxMin - 60 // ensure at least 1 hour room for end
                  if (disableStart) return
                  onStartTimeChange(t)
                  const startMin = timeToMinutes(t)
                  const requiredEndMin = startMin + 60
                  const validEnd = timeSlots.find((s) => timeToMinutes(s) >= requiredEndMin)
                  if (validEnd && timeToMinutes(endTime) < requiredEndMin) {
                    onEndTimeChange(validEnd)
                    // scrolling handled in effect that watches endTime
                  }
                }}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
              <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wide">
                Ora sfârșit
              </div>
              <TimeSlotList
                containerRef={endListRef}
                slots={timeSlots}
                selected={endTime}
                onSelect={(t) => onEndTimeChange(t)}
                isDisabled={(t) => timeToMinutes(t) < timeToMinutes(startTime) + 60}
              />
            </div>
          </div>
        </div>

        {/* Schedule Summary Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-xs p-6 border border-[var(--border)]">
          <h4 className="font-semibold text-base text-[var(--card-foreground)] mb-4">Rezumat dată</h4>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-xs text-[var(--muted-foreground)]">Data selectată</div>
                <div className="font-semibold text-[var(--foreground)] capitalize">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" })
                    : "Nicio dată selectată"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-xs text-[var(--muted-foreground)]">Interval orar</div>
                <div className="font-semibold text-[var(--foreground)]">
                  {startTime} — {endTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center flex-shrink-0">
                <Repeat size={18} />
              </div>
              <div>
                <div className="text-xs text-[var(--muted-foreground)]">Recurență</div>
                <div className="font-semibold text-[var(--foreground)] capitalize">
                  {recurrence === "niciuna" ? "Niciuna" : recurrence}
                </div>
              </div>
            </div>

            <Button
              type="button"
              id="confirm-date-btn"
              onClick={onConfirmSchedule}
              disabled={!selectedDate}
              rightIcon={<ArrowRight size={16} />}
              className="w-full mt-4 py-3 rounded-xl font-bold"
            >
              Confirmă data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function timeToMinutes(t: string) {
  const [hh, mm] = t.split(":").map(Number)
  return hh * 60 + (mm || 0)
}



function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBeforeToday(d: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compare = new Date(d)
  compare.setHours(0, 0, 0, 0)
  return compare.getTime() < today.getTime()
}
