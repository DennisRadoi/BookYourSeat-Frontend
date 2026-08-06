interface ProfileFieldProps {
  label: string
  type?: string
  value: string
  placeholder?: string
  disabled: boolean
  onChange: (value: string) => void
}

export function ProfileField({ label, type = "text", value, placeholder, disabled, onChange }: ProfileFieldProps) {
  return <label className="block min-w-0 text-[10px] font-medium text-[var(--muted-foreground)]">{label}<input type={type} value={value} disabled={disabled} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:cursor-not-allowed disabled:bg-[var(--muted)]" /></label>
}
