import { useEffect, useState } from "react"
import { Pencil, Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser, updateUserProfile, updateUserPreferences } from "@/services"
import type { User } from "@/types"

export default function ContPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [preferences, setPreferences] = useState<string[]>([])
  const [newPrefInput, setNewPrefInput] = useState("")
  const [isAddingPref, setIsAddingPref] = useState(false)

  const [formData, setFormData] = useState({
    name: "Bunea George",
    email: "buneageorge29@gmail.com",
    department: "",
    domiciliu: "",
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
        setFormData({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          department: user.department || "",
          domiciliu: user.domiciliu || "",
        })
        setPreferences(user.preferences.workPreferences)
      } catch (error) {
        console.error("Eroare la încărcarea profilului:", error)
      }
    }

    loadUserData()
  }, [])

  async function handleToggleEdit() {
    if (isEditing && currentUser) {
      try {
        const [firstName, ...rest] = formData.name.split(" ")
        const lastName = rest.join(" ")
        await updateUserProfile(currentUser.id, {
          firstName: firstName || currentUser.firstName,
          lastName: lastName || currentUser.lastName,
          email: formData.email,
          department: formData.department,
          domiciliu: formData.domiciliu,
        })
      } catch (error) {
        console.error("Eroare la salvarea profilului:", error)
      }
    }
    setIsEditing((prev) => !prev)
  }

  async function handleRemovePreference(p: string) {
    const updated = preferences.filter((x) => x !== p)
    setPreferences(updated)
    if (currentUser) {
      await updateUserPreferences(currentUser.id, { workPreferences: updated })
    }
  }

  async function handleAddPreference() {
    const trimmed = newPrefInput.trim()
    if (trimmed && !preferences.includes(trimmed)) {
      const updated = [...preferences, trimmed]
      setPreferences(updated)
      if (currentUser) {
        await updateUserPreferences(currentUser.id, { workPreferences: updated })
      }
    }
    setNewPrefInput("")
    setIsAddingPref(false)
  }

  return (
    <div className="flex max-w-[700px] flex-col gap-5 text-[#1f2937]">
      <Card className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <CardContent className="flex items-center gap-5 pt-6">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#059669] bg-[#d1fae5] text-lg font-bold text-[#059669]">
            {currentUser?.initials ?? "BG"}
          </div>

          <div className="flex flex-1 flex-col gap-0.5">
            <h2 className="m-0 text-lg font-bold text-[#1f2937]">{formData.name}</h2>
            <p className="m-0 text-sm text-[#6b7280]">{formData.email}</p>
            <p className="m-0 text-xs text-[#6b7280]">Preferă Etaj 1, lângă fereastră</p>
          </div>

          <Button
            variant="outline"
            id="cont-edit-profile-btn"
            onClick={handleToggleEdit}
            className="flex-shrink-0 rounded-full border-[#059669] text-[#059669] hover:bg-[#d1fae5] gap-1.5"
          >
            <Pencil size={14} />
            {isEditing ? "Salvează" : "Editează profilul"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <CardHeader className="pb-0">
          <h3 className="m-0 text-[15px] font-bold text-[#1f2937]">Informații personale</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            {[
              { id: "cont-input-name", label: "Nume complet", key: "name", placeholder: "" },
              { id: "cont-input-email", label: "Email", key: "email", placeholder: "" },
              {
                id: "cont-input-department",
                label: "Departament",
                key: "department",
                placeholder: isEditing ? "ex: IT" : "",
              },
              {
                id: "cont-input-domiciliu",
                label: "Domiciliu",
                key: "domiciliu",
                placeholder: isEditing ? "ex: București" : "",
              },
            ].map(({ id, label, key, placeholder }) => (
              <div key={id} className="flex flex-col gap-1.5">
                <label htmlFor={id} className="text-xs font-medium text-[#6b7280]">
                  {label}
                </label>
                <Input
                  id={id}
                  value={formData[key as keyof typeof formData]}
                  disabled={!isEditing}
                  placeholder={placeholder}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="rounded-lg border-[#e5e7eb] bg-[#f3f4f6] text-sm text-[#1f2937] focus:border-[#059669] disabled:opacity-80 disabled:cursor-default"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <CardHeader className="pb-0">
          <h3 className="m-0 text-[15px] font-bold text-[#1f2937]">Preferințe muncă</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {preferences.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-3 py-[5px] text-[13px] text-[#1f2937]"
                >
                  {p}
                  {isEditing && (
                    <button
                      onClick={() => handleRemovePreference(p)}
                      aria-label={`Șterge ${p}`}
                      className="flex items-center justify-center border-0 bg-transparent p-0 text-[#6b7280] cursor-pointer leading-none transition hover:text-[#ef4444]"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}

              {isAddingPref && (
                <input
                  autoFocus
                  value={newPrefInput}
                  onChange={(e) => setNewPrefInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddPreference()
                    if (e.key === "Escape") {
                      setIsAddingPref(false)
                      setNewPrefInput("")
                    }
                  }}
                  placeholder="Adaugă..."
                  className="w-[120px] rounded-full border border-[#059669] bg-white px-3 py-1 text-[13px] text-[#1f2937] outline-none"
                />
              )}
            </div>

            <Button
              id="cont-add-pref-btn"
              onClick={() => setIsAddingPref(true)}
              className="flex-shrink-0 rounded-full bg-[#059669] hover:bg-[#047857] text-white gap-1.5 text-[13px]"
            >
              <Plus size={14} />
              Adaugă preferințe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
