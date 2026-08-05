import { Search } from "lucide-react"

interface CompanyToolbarProps { 
  query: string; 
  officeOnly: boolean; 
  onQueryChange: (query: string) => void; 
  onOfficeOnlyChange: () => void 
}

export function CompanyToolbar({ query, officeOnly, onQueryChange, onOfficeOnlyChange }: CompanyToolbarProps) {
  return <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"><label className="flex min-h-12 max-w-[690px] flex-1 items-center gap-2.5 rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-4 text-[var(--muted-foreground)] shadow-sm transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20"><Search size={19} className="text-[var(--primary)]" aria-hidden="true" /><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Caută un coleg după nume" aria-label="Caută un coleg după nume" className="w-full border-0 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]" /></label><button type="button" className={`min-h-[42px] self-end rounded-[13px] border bg-[var(--card)] px-[18px] text-sm font-semibold transition sm:self-auto ${officeOnly ? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]" : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`} onClick={onOfficeOnlyChange} aria-pressed={officeOnly}>Filtru</button></div>
}
