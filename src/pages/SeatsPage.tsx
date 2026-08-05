import React, { useMemo, useState } from "react"

type Recurrence = "niciuna" | "zilnic" | "saptamanal" | "lunar"

export default function SeatsPage(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [monthOffset, setMonthOffset] = useState(0) // 0 = current month
  const [startTime, setStartTime] = useState<string | null>("08:00")
  const [endTime, setEndTime] = useState<string | null>("09:00")
  const [recurrence, setRecurrence] = useState<Recurrence>("niciuna")
  const [repeatEvery, setRepeatEvery] = useState<number>(1)
  const [endsMode, setEndsMode] = useState<"niciodata" | "la_data" | "dupa">("niciodata")
  const [endsAfterCount, setEndsAfterCount] = useState<number>(1)
  const [endsOnDate, setEndsOnDate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // build a list of time slots (30 minutes step) from 08:00 to 18:00
  const times = useMemo(() => {
    const list: string[] = []
    const start = 8
    const end = 18
    for (let h = start; h <= end; h++) {
      list.push(pad(h) + ":00")
      if (h < end) list.push(pad(h) + ":30")
    }
    return list
  }, [])

  // calendar calculations
  const calendar = useMemo(() => {
    const now = new Date()
    const display = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const month = display.getMonth()
    const year = display.getFullYear()

    const firstDay = new Date(year, month, 1).getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // build weeks array (Sunday-first)
    const cells: (Date | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)

    return { display, month, year, cells }
  }, [monthOffset])

  const monthLabel = useMemo(() => {
    return calendar.display.toLocaleString("ro-RO", { month: "long", year: "numeric" })
  }, [calendar])

  function pad(n: number) {
    return n.toString().padStart(2, "0")
  }

  function onSelectDate(d: Date | null) {
    setSelectedDate(d)
  }

  function onConfirm() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(`Data confirmată:\nData: ${selectedDate ? selectedDate.toLocaleDateString() : "Nicio dată"}\nOră: ${startTime} - ${endTime}\nRecurență: ${recurrence}`)
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Rezervă un loc</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Alegeți datele, intervalul orar și reccurența</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* main calendar column */}
          <div className="md:col-span-7 col-span-1">
            <div className="bg-[var(--card)] rounded-2xl shadow p-6 border border-[var(--border)]">
              <h3 className="text-[var(--card-foreground)] font-medium mb-4">Selectează date</h3>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMonthOffset((m) => m - 1)}
                                      className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-[var(--card)]"
                    aria-label="Luna precedentă"
                  >
                    ‹
                  </button>
                  <div className="font-medium text-[var(--card-foreground)]">{monthLabel}</div>
                  <button
                    onClick={() => setMonthOffset((m) => m + 1)}
                                      className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-[var(--card)]"
                    aria-label="Luna următoare"
                  >
                    ›
                  </button>
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">Apasă o dată pentru a selecta</div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-sm">
                {['Du','Lu','Ma','Mi','Jo','Vi','Sâ'].map((d) => (
                                  <div key={d} className="text-[var(--muted-foreground)] text-center font-medium py-1">{d}</div>
                ))}

                {calendar.cells.map((cell, idx) => {
                  const isSelected = cell && selectedDate && sameDay(cell, selectedDate)
                  const isToday = cell && sameDay(cell, new Date())
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectDate(cell)}
                      disabled={!cell}
                      className={`h-10 rounded-md flex items-center justify-center text-sm transition ${!cell ? 'opacity-30 cursor-default' : 'hover:bg-[var(--card)]'} ${isSelected ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold' : isToday ? 'ring-1 ring-[var(--border)]' : 'text-[var(--card-foreground)]'}` }
                    >
                      {cell ? cell.getDate() : ''}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* recurrence panel */}
            <div className="mt-6 bg-[var(--card)] rounded-2xl shadow p-6 border border-[var(--border)]">
              <div className="mb-3">
                <h4 className="font-medium text-[var(--card-foreground)]">Recurență</h4>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <RecurrenceButton active={recurrence === 'niciuna'} onClick={() => setRecurrence('niciuna')}>Niciuna</RecurrenceButton>
                <RecurrenceButton active={recurrence === 'zilnic'} onClick={() => setRecurrence('zilnic')}>Zilnic</RecurrenceButton>
                <RecurrenceButton active={recurrence === 'saptamanal'} onClick={() => setRecurrence('saptamanal')}>Săptămânal</RecurrenceButton>
                <RecurrenceButton active={recurrence === 'lunar'} onClick={() => setRecurrence('lunar')}>Lunar</RecurrenceButton>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center mb-4">
                              <label className="col-span-12 sm:col-span-3 text-[var(--muted-foreground)] text-sm">La fiecare</label>
                <input
                                className="col-span-12 sm:col-span-2 p-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] text-sm"
                  type="number"
                  min={1}
                  value={repeatEvery}
                  onChange={(e) => setRepeatEvery(Math.max(1, Number(e.target.value || 1)))}
                />
                              <div className="col-span-12 sm:col-span-7 text-[var(--muted-foreground)] text-sm">lună(i)</div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input className="accent-[var(--primary)] w-4 h-4" type="radio" name="ends" checked={endsMode === 'niciodata'} onChange={() => setEndsMode('niciodata')} />
                                        <span className={`text-sm ${endsMode === 'niciodata' ? 'text-[var(--primary)]' : 'text-[var(--card-foreground)]'}`}>Niciodată</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input className="accent-[var(--primary)] w-4 h-4" type="radio" name="ends" checked={endsMode === 'la_data'} onChange={() => setEndsMode('la_data')} />
                                        <span className={`text-sm ${endsMode === 'la_data' ? 'text-[var(--primary)]' : 'text-[var(--card-foreground)]'}`}>La data</span>
                    <input
                                          className="ml-3 p-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] text-sm"
                      type="date"
                      value={endsOnDate}
                      onChange={(e) => setEndsOnDate(e.target.value)}
                      disabled={endsMode !== 'la_data'}
                    />
                  </label>

                  <label className="flex items-center gap-3">
                    <input className="accent-[var(--primary)] w-4 h-4" type="radio" name="ends" checked={endsMode === 'dupa'} onChange={() => setEndsMode('dupa')} />
                    <span className={`text-sm ${endsMode === 'dupa' ? 'text-[var(--primary)]' : 'text-[var(--card-foreground)]'}`}>După</span>
                    <input
                                          className="ml-3 p-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] text-sm w-20"
                      type="number"
                      min={1}
                      value={endsAfterCount}
                      onChange={(e) => setEndsAfterCount(Math.max(1, Number(e.target.value || 1)))}
                      disabled={endsMode !== 'dupa'}
                    />
                    <span className="text-sm text-[var(--muted-foreground)]">repetări</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* right column: time interval + summary */}
          <div className="md:col-span-5 col-span-1 space-y-6">
            <div className="bg-[var(--card)] rounded-2xl shadow p-4 border border-[var(--border)]">
                          <h4 className="font-medium text-[var(--card-foreground)] mb-3">Interval orar</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                                  <div className="text-xs text-[var(--muted-foreground)] mb-2">Ora început</div>
                  <div className="space-y-2 max-h-40 sm:max-h-44 overflow-auto pr-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() => setStartTime(t)}
                        className={`w-full text-left p-2 rounded-md transition ${startTime === t ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold' : 'hover:bg-[var(--card)] text-[var(--card-foreground)]'}`}
                      >
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                                  <div className="text-xs text-[var(--muted-foreground)] mb-2">Ora sfârșit</div>
                  <div className="space-y-2 max-h-40 sm:max-h-44 overflow-auto pr-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() => setEndTime(t)}
                        className={`w-full text-left p-2 rounded-md transition ${endTime === t ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold' : 'hover:bg-[var(--card)] text-[var(--card-foreground)]'}`}
                      >
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-[var(--muted-foreground)]">{selectedDate ? `${formatDateShort(selectedDate)} — ${humanDuration(startTime, endTime)}` : '08:00 — 09:00'} <span className="text-[var(--primary)] font-medium">{humanDuration(startTime, endTime) || '1 h'}</span></div>
            </div>

            <div className="bg-[var(--card)] rounded-2xl shadow p-4 border border-[var(--border)]">
                          <h4 className="font-medium text-[var(--card-foreground)] mb-3">Rezumat</h4>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--card)] rounded-md flex items-center justify-center text-[var(--primary)]">📅</div>
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Data</div>
                                        <div className="text-[var(--card-foreground)] font-medium">{selectedDate ? formatDateLong(selectedDate) : 'Nicio dată selectată'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--card)] rounded-md flex items-center justify-center text-[var(--primary)]">⏰</div>
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Oră</div>
                                        <div className="text-[var(--card-foreground)] font-medium">{startTime} — {endTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--card)] rounded-md flex items-center justify-center text-[var(--primary)]">🔁</div>
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Recurență</div>
                                        <div className="text-[var(--card-foreground)] font-medium">{recurrence === 'niciuna' ? 'Niciuna' : recurrence === 'zilnic' ? 'Zilnic' : recurrence === 'saptamanal' ? 'Săptămânal' : 'Lunar'}</div>
                  </div>
                </div>

                <button
                  onClick={onConfirm}
                                  className="w-full mt-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold py-2 rounded-lg disabled:opacity-60"
                  disabled={isLoading || !selectedDate}
                >
                  {isLoading ? 'Se confirmă...' : 'Confirmă data'}
                </button>

                                <div className="text-xs text-[var(--muted-foreground)]">Selectați o dată pentru a continua</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// small helpers & subcomponents
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatTime(t: string) {
  const [hh, mm] = t.split(":").map(Number)
  const date = new Date()
  date.setHours(hh, mm)
  return date.toLocaleTimeString("ro-RO", { hour: 'numeric', minute: '2-digit' })
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("ro-RO")
}

function formatDateLong(d: Date) {
  return d.toLocaleDateString("ro-RO", { weekday: 'long', month: 'long', day: 'numeric' })
}

function humanDuration(s?: string | null, e?: string | null) {
  if (!s || !e) return ''
  const [sh, sm] = s.split(":").map(Number)
  const [eh, em] = e.split(":").map(Number)
  const start = sh * 60 + sm
  const end = eh * 60 + em
  const diff = Math.max(0, end - start)
  const hours = Math.floor(diff / 60)
  const mins = diff % 60
  if (hours && mins) return `${hours} h ${mins} min`
  if (hours) return `${hours} h`
  return `${mins} min`
}

function RecurrenceButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm font-medium border ${active ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]' : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)]'}`}
    >
      {children}
    </button>
  )
}
