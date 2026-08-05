interface OccupancyLineChartProps {
  data: { label: string; value: number }[]
  maxValue?: number
}

const CHART_W = 560
const CHART_H = 260
const PAD_LEFT = 34
const PAD_RIGHT = 12
const PAD_TOP = 24
const PAD_BOTTOM = 32

/** Catmull-Rom -> cubic Bezier smoothing, so the line reads as a soft curve, not straight segments */
function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ""
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function OccupancyLineChart({ data, maxValue = 100 }: OccupancyLineChartProps) {
  const plotW = CHART_W - PAD_LEFT - PAD_RIGHT
  const plotH = CHART_H - PAD_TOP - PAD_BOTTOM
  const gridSteps = 5
  const stepValue = maxValue / gridSteps

  const points = data.map((d, i) => ({
    x: PAD_LEFT + (i / (data.length - 1)) * plotW,
    y: PAD_TOP + plotH - (d.value / maxValue) * plotH,
  }))

  const linePath = buildSmoothPath(points)
  const baseline = PAD_TOP + plotH
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Rata de ocupare pe saptamani"
    >
      {Array.from({ length: gridSteps + 1 }, (_, i) => {
        const value = i * stepValue
        const y = PAD_TOP + plotH - (value / maxValue) * plotH
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

      <path d={areaPath} fill="var(--primary)" fillOpacity={0.12} stroke="none" />
      <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" />

      {points.map((p, i) => (
        <g key={data[i].label}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="var(--primary)" stroke="var(--card)" strokeWidth={1.5} />
          <text
            x={p.x}
            y={CHART_H - PAD_BOTTOM + 16}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={10}
          >
            {data[i].label}
          </text>
        </g>
      ))}
    </svg>
  )
}