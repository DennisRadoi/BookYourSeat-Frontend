interface TopBookingEntry {
  name: string
  seats: number
  percent: number
}

interface TopBookingsListProps {
  entries: TopBookingEntry[]
}

export function TopBookingsList({ entries }: TopBookingsListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {entries.map((entry, i) => (
        <li key={`${entry.name}-${i}`}>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold text-foreground">{entry.name}</span>
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {entry.seats} locuri
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${entry.percent}%` }}
              />
            </div>
            <span className="w-10 shrink-0 rounded-full bg-primary px-2 py-0.5 text-center text-[11px] font-bold text-primary-foreground">
              {entry.percent}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}