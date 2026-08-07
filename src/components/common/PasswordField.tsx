import { Eye, EyeOff } from "lucide-react"
import { IconButton } from "@/components/ui"

interface PasswordFieldProps {
  label: string
  placeholder: string
  showPassword: boolean
  onToggle: () => void
  value: string
  onChange: (value: string) => void
}

export function PasswordField({ label, placeholder, showPassword, onToggle, value, onChange }: PasswordFieldProps) {
  return (
    <label className="block text-[10px] text-[var(--muted-foreground)]">
      {label}
      <span className="relative mt-1 block">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 pr-8 text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)]"
        />
        <IconButton
          type="button"
          size="xs"
          variant="ghost"
          onClick={onToggle}
          aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
          className="absolute inset-y-0 right-1 my-auto h-6 w-6 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
        >
          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
        </IconButton>
      </span>
    </label>
  )
}
