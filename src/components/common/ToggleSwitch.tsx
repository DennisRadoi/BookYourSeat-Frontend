interface ToggleSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

export function ToggleSwitch({ checked, onCheckedChange, label }: ToggleSwitchProps) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onCheckedChange(!checked)} className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition sm:mt-0 ${checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}><span className={`absolute top-1 size-3 rounded-full bg-[var(--card-foreground)] shadow transition ${checked ? "left-5" : "left-1"}`} /></button>
}
