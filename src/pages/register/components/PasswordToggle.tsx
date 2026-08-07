import { IconButton } from "@/components/ui"

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>
}

function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M3 3l18 18" /><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" /><path d="M9 6.3a10.7 10.7 0 0 1 3-.3c6 0 9.5 6 9.5 6a18.8 18.8 0 0 1-4.1 4.8" /><path d="M6.4 8.4A18.3 18.3 0 0 0 2.5 12s3.5 6 9.5 6c1.7 0 3.2-.3 4.6-.8" /></svg>
}

interface PasswordToggleProps { isVisible: boolean; onToggle: () => void; label: string }

export function PasswordToggle({ isVisible, onToggle, label }: PasswordToggleProps) {
  return (
    <IconButton
      type="button"
      onClick={onToggle}
      aria-label={label}
      size="xs"
      className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {isVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
    </IconButton>
  )
}

