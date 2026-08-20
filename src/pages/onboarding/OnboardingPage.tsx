import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input } from "@/components/ui"
import { completeOnboarding, getDepartments, type AddressFormData } from "@/services"
import { isValidPhoneNumber, isValidPostalCode } from "@/lib/validation"

const emptyAddress: AddressFormData = { county: "", locality: "", street: "", number: "", apartmentBlock: "", floor: "", postalCode: "" }
const addressFields: Array<[keyof AddressFormData, string]> = [["county", "Județ"], ["locality", "Localitate"], ["street", "Stradă"], ["number", "Număr"], ["apartmentBlock", "Bloc"], ["floor", "Etaj"], ["postalCode", "Cod poștal"]]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ departmentName: "", phoneNumber: "", role: "", employmentDate: new Date().toISOString().slice(0, 10), address: emptyAddress })
  useEffect(() => { getDepartments().then(setDepartments).catch(() => setError("Nu s-au putut încărca departamentele.")) }, [])
  const setAddress = (key: keyof AddressFormData, value: string) => setForm((current) => ({ ...current, address: { ...current.address, [key]: value } }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    if (!isValidPhoneNumber(form.phoneNumber)) return setError("Numărul de telefon trebuie să conțină exact 10 cifre.")
    if (!isValidPostalCode(form.address.postalCode)) return setError("Codul poștal trebuie să conțină exact 6 cifre.")
    setSaving(true)
    try { await completeOnboarding(form); navigate("/") }
    catch (err) { setError(err instanceof Error ? err.message : "Datele nu au putut fi salvate.") }
    finally { setSaving(false) }
  }

  return <main className="mx-auto max-w-3xl p-6"><h1 className="text-2xl font-bold">Completează-ți profilul</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Aceste date sunt necesare pentru rezervări și recomandări.</p><form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl bg-[var(--card)] p-5"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Departament<select required value={form.departmentName} onChange={(e) => setForm({ ...form, departmentName: e.target.value })} className="mt-1 w-full rounded-md border bg-background p-2"><option value="">Alege departamentul</option>{departments.map((department) => <option key={department.id} value={department.name}>{department.name}</option>)}</select></label><label className="text-sm font-semibold">Telefon<Input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "") })} placeholder="0712345678" /></label><label className="text-sm font-semibold">Rol<Input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></label><label className="text-sm font-semibold">Data angajării<Input required type="date" value={form.employmentDate} onChange={(e) => setForm({ ...form, employmentDate: e.target.value })} /></label></div><h2 className="pt-2 text-lg font-bold">Adresă</h2><div className="grid gap-4 sm:grid-cols-2">{addressFields.map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<Input required={key !== "apartmentBlock" && key !== "floor"} inputMode={key === "postalCode" ? "numeric" : undefined} pattern={key === "postalCode" ? "[0-9]{6}" : undefined} maxLength={key === "postalCode" ? 6 : undefined} value={form.address[key]} onChange={(e) => setAddress(key, key === "postalCode" ? e.target.value.replace(/\D/g, "") : e.target.value)} /></label>)}</div>{error && <p className="text-sm text-destructive">{error}</p>}<Button type="submit" isLoading={saving}>Salvează și continuă</Button></form></main>
}
