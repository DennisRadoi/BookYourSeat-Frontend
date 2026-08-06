import { ToggleSwitch } from "@/components/common/ToggleSwitch"

interface ToggleRowProps {
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}

export function ToggleRow({ title, description, enabled, onChange }: ToggleRowProps) {
  return <div className="flex min-h-[61px] items-start justify-between gap-3 py-3 sm:items-center"><div className="min-w-0"><p className="text-xs font-semibold text-[var(--foreground)]">{title}</p><p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">{description}</p></div><ToggleSwitch checked={enabled} onCheckedChange={onChange} label={title} /></div>
}
