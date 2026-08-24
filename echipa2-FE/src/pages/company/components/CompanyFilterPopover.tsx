import { Button, PillButton } from "@/components/ui"

export interface CompanyFilters { status: string; building: string; favorite: string }

interface Props { open: boolean; filters: CompanyFilters; buildings: string[]; onChange: (filters: CompanyFilters) => void; onClose: () => void }

export function activeFilterCount(filters: CompanyFilters) {
  return Number(filters.status !== "all") + Number(filters.building !== "all") + Number(filters.favorite !== "all")
}

const statusOptions = [{ value: "all", label: "Toți" }, { value: "La birou", label: "La birou" }, { value: "Remote", label: "Remote" }]
const favoriteOptions = [{ value: "all", label: "Toți" }, { value: "favorite", label: "Favoriți" }, { value: "non-favorite", label: "Ceilalți" }]

export function CompanyFilterPopover({ open, filters, buildings, onChange, onClose }: Props) {
  if (!open) return null
  const update = (patch: Partial<CompanyFilters>) => onChange({ ...filters, ...patch })
  const options = (title: string, items: { value: string; label: string }[], current: string, key: keyof CompanyFilters) => <div className="mb-3"><p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">{title}</p><div className="flex flex-wrap gap-2">{items.map((item) => <PillButton key={item.value} type="button" size="xs" isActive={current === item.value} onClick={() => update({ [key]: item.value })}>{item.label}</PillButton>)}</div></div>
  return <><div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" /><div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl" role="dialog" aria-label="Filtre colegi"><div className="mb-3 flex items-center justify-between"><span className="text-[13px] font-bold">Filtre</span>{activeFilterCount(filters) > 0 && <Button variant="link" size="xs" onClick={() => onChange({ status: "all", building: "all", favorite: "all" })}>Resetează</Button>}</div>{options("Status", statusOptions, filters.status, "status")}{buildings.length > 0 && options("Clădire", [{ value: "all", label: "Toate" }, ...buildings.map((name) => ({ value: name, label: name }))], filters.building, "building")}{options("Favoriți", favoriteOptions, filters.favorite, "favorite")}<Button onClick={onClose} className="w-full font-bold">Aplică</Button></div></>
}
