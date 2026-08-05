interface ProfileMetricCardProps {
  icon: React.ReactNode
  value: string
  label: string
  color: string
}

export function ProfileMetricCard({ icon, value, label, color }: ProfileMetricCardProps) {
  return <article className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"><span className={`grid size-6 place-items-center rounded-md ${color}`}>{icon}</span><p className="mt-2 truncate text-xs font-bold text-[var(--foreground)]">{value}</p><p className="mt-0.5 truncate text-[9px] text-[var(--muted-foreground)]">{label}</p></article>
}
