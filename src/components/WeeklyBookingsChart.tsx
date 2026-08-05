interface WeeklyBookingsChartProps {
  data: { day: string; birouri: number; sali: number }[]
  maxValue?: number
}

const CHART_W = 560
const CHART_H = 260
const PAD_LEFT = 34
const PAD_RIGHT = 12
const PAD_TOP = 16
const PAD_BOTTOM = 32

export function WeeklyBookingsChart({ data, maxValue = 40 }: WeeklyBookingsChartProps) {
  const plotW = CHART_W - PAD_LEFT - PAD_RIGHT
  const plotH = CHART_H - PAD_TOP - PAD_BOTTOM
  const gridSteps = 5
  const stepValue = maxValue / gridSteps

  const groupW = plotW / data.length
  const barW = groupW * 0.26
  const barGap = groupW * 0.08

  function yFor(value: number) {
    return PAD_TOP + plotH - (value / maxValue) * plotH
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Bookings pe saptamana, birouri si sali de conferinta"
      >
        {/* grid lines + Y labels */}
        {Array.from({ length: gridSteps + 1 }, (_, i) => {
          const value = i * stepValue
          const y = yFor(value)
          return (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                x2={CHART_W - PAD_RIGHT}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeDasharray={i === 0 ? undefined : "3 4"}
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {value}
              </text>
            </g>
          )
        })}

        {/* bars */}
        {data.map((d, i) => {
          const groupX = PAD_LEFT + i * groupW
          const pairW = barW * 2 + barGap
          const startX = groupX + (groupW - pairW) / 2

          const hBirouri = (d.birouri / maxValue) * plotH
          const hSali = (d.sali / maxValue) * plotH

          return (
            <g key={d.day}>
              <rect
                x={startX}
                y={PAD_TOP + plotH - hBirouri}
                width={barW}
                height={hBirouri}
                rx={4}
                fill="var(--primary)"
              />
              <rect
                x={startX + barW + barGap}
                y={PAD_TOP + plotH - hSali}
                width={barW}
                height={hSali}
                rx={4}
                fill="var(--warning)"
              />
              <text
                x={groupX + groupW / 2}
                y={CHART_H - PAD_BOTTOM + 16}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {d.day}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Birouri
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[var(--warning)]" /> Sali
        </span>
      </div>
    </div>
  )
}