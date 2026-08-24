import { Pencil, X, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { answerInvitation, getCurrentUser, getMyInvitations, updateUserAddress, updateUserProfile, updateUserPreferences, type AddressFormData } from "@/services"
import type { InvitationDirection, OfficeInvitation } from "@/services"
import type { User } from "@/types"
import { ProfileField } from "./components/ProfileField"
import { AlertBanner } from "@/components/common"
import { Button, IconButton } from "@/components/ui"
import { isValidPostalCode } from "@/lib/validation"

export default function ContPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [preferences, setPreferences] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState("")
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [invitationDirection, setInvitationDirection] = useState<InvitationDirection>("received")
  const [invitations, setInvitations] = useState<OfficeInvitation[]>([])
  const [invitationsLoading, setInvitationsLoading] = useState(true)
  const [invitationError, setInvitationError] = useState<string | null>(null)
  const [respondingInvitationId, setRespondingInvitationId] = useState<number | null>(null)
  const addressCardRef = useRef<HTMLElement | null>(null)
  const [address, setAddress] = useState<AddressFormData>({ county: "", locality: "", street: "", number: "", apartmentBlock: "", floor: "", postalCode: "" })
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    domiciliu: "",
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
          domiciliu: currentUser.domiciliu || "",
        })
      } catch (err) {
        console.error("Error loading user in ContPage:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [])

  useEffect(() => {
    let active = true
    setInvitationsLoading(true)
    getMyInvitations(invitationDirection)
      .then((data) => active && setInvitations(data))
      .catch((error) => console.error("Nu s-au putut încărca invitațiile:", error))
      .finally(() => active && setInvitationsLoading(false))
    return () => { active = false }
  }, [invitationDirection])

  async function respondToInvitation(id: number, status: "ACCEPTATA" | "REFUZATA") {
    setInvitationError(null)
    setRespondingInvitationId(id)
    try {
      const updated = await answerInvitation(id, status)
      setInvitations((current) => current.map((invitation) => invitation.id === id ? updated : invitation))
    } catch (error) {
      console.error("Nu s-a putut răspunde invitației:", error)
      setInvitationError(error instanceof Error ? error.message : "Nu s-a putut răspunde invitației.")
    } finally {
      setRespondingInvitationId(null)
    }
  }

  async function handleToggleEdit() {
    if (!editing) {
      setEditing(true)
      requestAnimationFrame(() => addressCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }))
      return
    }

    const trimmedAddress = Object.fromEntries(Object.entries(address).map(([key, value]) => [key, value.trim()])) as AddressFormData
    const hasAddressChanges = Object.values(trimmedAddress).some(Boolean)
    if (hasAddressChanges && trimmedAddress.county && !trimmedAddress.locality) {
      setAddressError("Pentru schimbarea județului trebuie să completezi și localitatea.")
      return
    }
    if (hasAddressChanges && trimmedAddress.locality && (!trimmedAddress.street || !trimmedAddress.number || !trimmedAddress.postalCode)) {
      setAddressError("Pentru schimbarea localității, strada, numărul și codul poștal sunt obligatorii.")
      return
    }
    if (hasAddressChanges && trimmedAddress.postalCode && !isValidPostalCode(trimmedAddress.postalCode)) {
      setAddressError("Codul poștal trebuie să conțină exact 6 cifre.")
      return
    }

    if (editing && user) {
      try {
        setSaveError(false)
        setAddressError(null)
        const nameParts = form.name.split(" ")
        const firstName = nameParts[0] || user.firstName
        const lastName = nameParts.slice(1).join(" ") || user.lastName

        await updateUserProfile(user.id, { firstName, lastName, email: form.email, department: form.department, domiciliu: form.domiciliu })
        if (hasAddressChanges) await updateUserAddress(trimmedAddress)
        await updateUserPreferences(user.id, { workPreferences: preferences })
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 2500)
      } catch (error) {
        console.error("Nu s-a putut salva profilul:", error)
        setSaveError(true)
        return
      }
    }
    setEditing(false)
  }

  function removePreference(preference: string) {
    setPreferences((current) => current.filter((item) => item !== preference))
  }

  function addPreference() {
    const value = newPreference.trim()
    if (value && !preferences.includes(value)) setPreferences((current) => [...current, value])
    setNewPreference("")
  }

  if (isLoading) {
    return (
      <section className="w-full max-w-[760px] space-y-5 text-[var(--foreground)] sm:space-y-6">
        <div className="flex flex-col gap-4 rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:flex-row sm:items-center sm:p-5 animate-pulse">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--muted)] sm:size-16" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-[var(--muted)]" />
            <div className="h-3 w-56 rounded bg-[var(--muted)]" />
          </div>
        </div>
        <div className="rounded-xl bg-[var(--card)] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.07)] space-y-3 animate-pulse">
          {[1,2,3,4].map((i) => <div key={i} className="h-9 rounded-lg bg-[var(--muted)]" />)}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-[760px] space-y-5 text-[var(--foreground)] sm:space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:flex-row sm:items-center sm:p-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-[var(--primary)] bg-[var(--secondary)] text-sm font-bold text-[var(--secondary-foreground)] sm:size-16">
          {user?.initials || ""}
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
              <span key={preference} className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
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
          </div>
          {editing && <select value={newPreference} onChange={(event) => setNewPreference(event.target.value)} className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 text-xs"><option value="">Adaugă preferință</option>{["Loc liniștit", "Lângă fereastră"].filter((option) => !preferences.includes(option)).map((option) => <option key={option} value={option}>{option}</option>)}</select>}
          {editing && newPreference && <Button type="button" variant="secondary" size="sm" onClick={addPreference}>Adaugă</Button>}
        </div>
      </section>

      <section ref={addressCardRef} className="rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-5">
        <h3 className="text-xs font-bold text-[var(--foreground)]">Adresă</h3>
        {addressError && <p className="mt-3 rounded-md bg-[var(--destructive)]/10 p-2 text-xs font-medium text-[var(--destructive)]">{addressError}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{([['county','Județ'],['locality','Localitate'],['street','Stradă'],['number','Număr'],['apartmentBlock','Bloc'],['floor','Etaj'],['postalCode','Cod poștal']] as Array<[keyof AddressFormData,string]>).map(([key,label]) => <ProfileField key={key} label={label} value={address[key]} disabled={!editing} onChange={(value) => setAddress((current) => ({ ...current, [key]: value }))} />)}</div>
      </section>

      <section className="rounded-xl bg-[var(--card)] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-[var(--foreground)]">Invitații la birou</h3>
          <div className="flex rounded-lg bg-[var(--muted)] p-1 text-xs">
            {(["received", "sent"] as const).map((direction) => <button key={direction} type="button" onClick={() => setInvitationDirection(direction)} className={`rounded-md px-3 py-1.5 font-semibold ${invitationDirection === direction ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)]"}`}>{direction === "received" ? "Primite" : "Trimise"}</button>)}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {invitationsLoading && <p className="text-xs text-[var(--muted-foreground)]">Se încarcă invitațiile...</p>}
          {invitationError && <p className="rounded-md bg-[var(--destructive)]/10 p-2 text-xs font-medium text-[var(--destructive)]">{invitationError}</p>}
          {!invitationsLoading && invitations.length === 0 && <p className="text-xs text-[var(--muted-foreground)]">Nu există invitații {invitationDirection === "received" ? "primite" : "trimise"}.</p>}
          {invitations.map((invitation) => <article key={invitation.id} className="rounded-lg border border-[var(--border)] p-3 text-xs"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold text-[var(--foreground)]">{invitationDirection === "received" ? `De la ${invitation.senderName || `Utilizator #${invitation.senderId}`}` : `Către ${invitation.receiverName || `Utilizator #${invitation.receiverId}`}`}</p><p className="mt-1 text-[var(--muted-foreground)]">{invitation.proposedDate}{invitation.message ? ` · ${invitation.message}` : ""}</p></div><span className="rounded-full bg-[var(--muted)] px-2 py-1 font-semibold text-[var(--muted-foreground)]">{invitation.status.replace("IN_ASTEPTARE", "În așteptare").replace("ACCEPTATA", "Acceptată").replace("REFUZATA", "Refuzată")}</span></div>{invitationDirection === "received" && invitation.status === "IN_ASTEPTARE" && <div className="mt-3 flex gap-2"><Button size="sm" isLoading={respondingInvitationId === invitation.id} disabled={respondingInvitationId !== null} onClick={() => respondToInvitation(invitation.id, "ACCEPTATA")}>Acceptă</Button><Button size="sm" variant="outline" disabled={respondingInvitationId !== null} onClick={() => respondToInvitation(invitation.id, "REFUZATA")}>Refuză</Button></div>}</article>)}
        </div>
      </section>
    </section>
  )
}
