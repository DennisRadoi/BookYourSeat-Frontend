interface DonutSegment {
  label: string
  value: number
  color: string
}

interface ZoneDonutChartProps {
  segments: DonutSegment[]
}

const SIZE = 200
const RADIUS = 70
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ZoneDonutChart({ segments }: ZoneDonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  let cumulative = 0

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={168}
          height={168}
          role="img"
          aria-label="Birouri dupa zone"
        >
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            {segments.map((segment) => {
              const length = (segment.value / total) * CIRCUMFERENCE
              const dashArray = `${length} ${CIRCUMFERENCE - length}`
              const dashOffset = -cumulative
              cumulative += length
              return (
                <circle
                  key={segment.label}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                />
              )
            })}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{total}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-foreground">{segment.label}</span>
            <span>{segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}