import { Pencil, Plus, X, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentUser, updateUserProfile, updateUserPreferences } from "@/services"
import type { User } from "@/types"
import { ProfileField } from "./components/ProfileField"
import { AlertBanner } from "@/components/common"
import { Button, IconButton } from "@/components/ui"

export default function ContPage() {
  const [user, setUser] = useState<User | null>(null)
  const [editing, setEditing] = useState(false)
  const [preferences, setPreferences] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState("")
  const [addingPreference, setAddingPreference] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [form, setForm] = useState({
    name: "Claudiu Ciupitu",
    email: "claudiu.ciupitu@bys.ro",
    department: "Engineering",
    domiciliu: "București, Nițu Vasile 58",
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setPreferences(currentUser.preferences.workPreferences || [])
        setForm({
          name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
          email: currentUser.email,
          department: currentUser.department || "",
          domiciliu: currentUser.domiciliu || "București, Nițu Vasile 58",
        })
      } catch (err) {
        console.error("Error loading user in ContPage:", err)
      }
    }
    loadUserData()
  }, [])

  async function handleToggleEdit() {
    if (editing && user) {
      try {
        setSaveError(false)
        const nameParts = form.name.split(" ")
        const firstName = nameParts[0] || user.firstName
        const lastName = nameParts.slice(1).join(" ") || user.lastName

        await updateUserProfile(user.id, { firstName, lastName, email: form.email, department: form.department, domiciliu: form.domiciliu })
        await updateUserPreferences(user.id, { workPreferences: preferences })
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 2500)
      } catch (error) {
        console.error("Nu s-a putut salva profilul:", error)
        setSaveError(true)
        return
      }
    }
    setEditing((val) => !val)
  }

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
    <section className="w-full max-w-[760px] space-y-5 text-[var(--foreground)] sm:space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:flex-row sm:items-center sm:p-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-[var(--primary)] bg-[var(--secondary)] text-sm font-bold text-[var(--secondary-foreground)] sm:size-16">
          {user?.initials || "CC"}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-[var(--foreground)] sm:text-base">{form.name}</h2>
          <p className="truncate text-xs text-[var(--muted-foreground)]">{form.email}</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
            Domiciliu: <strong className="text-[var(--foreground)] font-medium">{form.domiciliu}</strong>
          </p>
        </div>
        <Button
          id="cont-edit-profile-btn"
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleToggleEdit}
          leftIcon={editing ? <Check size={14} /> : <Pencil size={14} />}
          className="w-full sm:w-auto font-bold"
        >
          {editing ? "Salvează" : "Editează profilul"}
        </Button>
      </div>

      {savedSuccess && (
        <AlertBanner variant="success">
          Profilul și adresa de domiciliu au fost salvate cu succes! AI-ul va recalcula traseul.
        </AlertBanner>
      )}
      {saveError && (
        <AlertBanner variant="error">
          Profilul nu a putut fi salvat. Verifică datele și încearcă din nou.
        </AlertBanner>
      )}

      <section className="rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-5">
        <h3 className="text-xs font-bold text-[var(--foreground)]">Informații personale & Domiciliu (Ruta AI)</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
          <ProfileField label="Nume complet" value={form.name} disabled={!editing} onChange={(name) => setForm({ ...form, name })} />
          <ProfileField label="Email" type="email" value={form.email} disabled={!editing} onChange={(email) => setForm({ ...form, email })} />
          <ProfileField label="Departament" value={form.department} disabled={!editing} placeholder="ex: Engineering" onChange={(department) => setForm({ ...form, department })} />
          <ProfileField label="Adresă domiciliu (Plecare)" value={form.domiciliu} disabled={!editing} placeholder="ex: București, Nițu Vasile 58" onChange={(domiciliu) => setForm({ ...form, domiciliu })} />
        </div>
      </section>

      <section className="rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-5">
        <h3 className="text-xs font-bold text-[var(--foreground)]">Preferințe muncă</h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap gap-2">
            {preferences.map((preference) => (
              <span key={preference} className="inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-[10px] font-medium text-[var(--foreground)]">
                <span className="truncate">{preference}</span>
                {editing && (
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removePreference(preference)}
                    aria-label={`Șterge ${preference}`}
                    className="h-4 w-4 rounded-full p-0 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                  >
                    <X size={12} />
                  </IconButton>
                )}
              </span>
            ))}
            {addingPreference && <input autoFocus value={newPreference} onChange={(event) => setNewPreference(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addPreference(); if (event.key === "Escape") { setAddingPreference(false); setNewPreference("") } }} placeholder="Adaugă..." className="h-7 min-w-24 rounded-full border border-[var(--primary)] bg-[var(--card)] px-2 text-[10px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none" />}
          </div>
          <Button
            id="cont-add-pref-btn"
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => addingPreference ? addPreference() : setAddingPreference(true)}
            leftIcon={<Plus size={14} />}
            className="w-full sm:w-auto font-bold"
          >
            {addingPreference ? "Adaugă" : "Adaugă preferințe"}
          </Button>
        </div>
      </section>
    </section>
  )
}
