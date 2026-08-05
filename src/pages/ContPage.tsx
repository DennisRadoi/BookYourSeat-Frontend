import { Pencil, Plus, X } from "lucide-react"
import { useState } from "react"

const initialPreferences = ["Lângă fereastră", "Zone liniștite", "Aproape de Anna H."]

export default function ContPage() {
  const [editing, setEditing] = useState(false)
  const [preferences, setPreferences] = useState(initialPreferences)
  const [newPreference, setNewPreference] = useState("")
  const [addingPreference, setAddingPreference] = useState(false)
  const [form, setForm] = useState({
    name: "Claudiu Ciupițu",
    email: "claudiuciupitu@gmail.com",
    department: "",
    domicile: "",
  })

  function removePreference(preference: string) {
    setPreferences((current) => current.filter((item) => item !== preference))
  }

  function addPreference() {
    const value = newPreference.trim()
    if (value && !preferences.includes(value)) setPreferences((current) => [...current, value])
    setNewPreference("")
    setAddingPreference(false)
  }

  return (
    <section className="w-full max-w-[760px] space-y-5 text-[#2b3431] sm:space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:flex-row sm:items-center sm:p-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-[#12b789] bg-[#d7fae9] text-sm font-bold text-[#078b65] sm:size-16">
          CC
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-[#29322f] sm:text-base">{form.name}</h2>
          <p className="truncate text-xs text-[#5e6865]">{form.email}</p>
          <p className="mt-0.5 text-[11px] text-[#68736f]">Preferă Etaj 1, lângă fereastră</p>
        </div>
        <button
          id="cont-edit-profile-btn"
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#d9f9e9] px-3 text-xs font-bold text-[#0b9e72] transition hover:bg-[#c3f2dc] focus:outline-none focus:ring-2 focus:ring-[#08a477] focus:ring-offset-2 sm:w-auto"
        >
          <Pencil size={14} />
          {editing ? "Salvează" : "Editează profilul"}
        </button>
      </div>

      <section className="rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-5">
        <h3 className="text-xs font-bold text-[#535d5a]">Informații personale</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
          <ProfileField label="Nume complet" value={form.name} disabled={!editing} onChange={(name) => setForm({ ...form, name })} />
          <ProfileField label="Email" type="email" value={form.email} disabled={!editing} onChange={(email) => setForm({ ...form, email })} />
          <ProfileField label="Departament" value={form.department} disabled={!editing} placeholder="ex: IT" onChange={(department) => setForm({ ...form, department })} />
          <ProfileField label="Domiciliu" value={form.domicile} disabled={!editing} placeholder="ex: București" onChange={(domicile) => setForm({ ...form, domicile })} />
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-5">
        <h3 className="text-xs font-bold text-[#535d5a]">Preferințe muncă</h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap gap-2">
            {preferences.map((preference) => (
              <span key={preference} className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#ccd2d0] bg-[#f9faf9] px-2.5 py-1 text-[10px] font-medium text-[#59635f]">
                <span className="truncate">{preference}</span>
                {editing && <button type="button" onClick={() => removePreference(preference)} aria-label={`Șterge ${preference}`} className="shrink-0 rounded-full text-[#8d9693] hover:text-[#e16060]"><X size={12} /></button>}
              </span>
            ))}
            {addingPreference && <input autoFocus value={newPreference} onChange={(event) => setNewPreference(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addPreference(); if (event.key === "Escape") { setAddingPreference(false); setNewPreference("") } }} placeholder="Adaugă..." className="h-7 min-w-24 rounded-full border border-[#08a477] px-2 text-[10px] outline-none" />}
          </div>
          <button id="cont-add-pref-btn" type="button" onClick={() => addingPreference ? addPreference() : setAddingPreference(true)} className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#d9f9e9] px-3 text-xs font-bold text-[#0b9e72] transition hover:bg-[#c3f2dc] sm:w-auto">
            <Plus size={14} />
            {addingPreference ? "Adaugă" : "Adaugă preferințe"}
          </button>
        </div>
      </section>
    </section>
  )
}

function ProfileField({ label, type = "text", value, placeholder, disabled, onChange }: { label: string; type?: string; value: string; placeholder?: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="block min-w-0 text-[10px] font-medium text-[#626c69]">
      {label}
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-9 w-full rounded-lg border border-[#e3e7e6] bg-white px-2.5 text-xs text-[#4c5653] outline-none placeholder:text-[#b2b8b6] focus:border-[#08a477] focus:ring-2 focus:ring-[#08a477]/15 disabled:cursor-not-allowed disabled:bg-[#fafbfb]"
      />
    </label>
  )
}
