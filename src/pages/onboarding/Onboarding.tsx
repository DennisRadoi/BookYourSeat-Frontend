import { useState, useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Star, ChevronDown, User as UserIcon } from "lucide-react"
import { AuthLayout } from "@/layouts"
import { Button, Input } from "@/components/ui"
import { getCurrentUser, updateUserProfile, updateUserPreferences } from "@/services"
import { colleagues } from "@/data/colleagues"
import type { User } from "@/types"

const LOCATII_DISPONIBILE = [
  "Parter - Săli de birou (11 locuri)",
  "Etaj 1 - Săli de birou (17 locuri)",
  "Etaj 2 - Săli de birou (16 locuri)",
  "Corpul T1, Etaj 1 - Evenimente (25 locuri)",
  "Corpul T1, Etaj 1 - Side-evenimente 1 (5 locuri)",
  "Corpul T1, Etaj 1 - Stand-up Chat room (15 locuri)",
  "Corpul T1, Etaj 1 - La Terasă (10 locuri)",
  "Corpul T1, Parter - Lounge (8 locuri)",
  "Corpul T1, Etaj 2 - Tenis (5 locuri)",
  "Corpul T1, Etaj 2 - Gaming (11 locuri)",
  "Corpul T2, Etaj 1 - Sala 404 (10 locuri)",
  "Corpul T2, Etaj 2 - Outland (10 locuri)",
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [domiciliu, setDomiciliu] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedColleagueIds, setSelectedColleagueIds] = useState<number[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
        setDomiciliu(user.domiciliu || "")
        if (user.preferences?.favoriteColleagueIds) {
          setSelectedColleagueIds(user.preferences.favoriteColleagueIds)
        }
        if (user.preferences?.preferredLocation) {
          setSelectedLocation(user.preferences.preferredLocation)
        }
      } catch (err) {
        console.error("Eroare la încărcarea datelor utilizatorului:", err)
      }
    }
    loadData()
  }, [])

  const filteredColleagues = colleagues.filter((colleague) =>
    colleague.name.toLowerCase().includes(searchQuery.toLowerCase())
  )


  function toggleColleague(id: number) {
    setSelectedColleagueIds((prev) =>
      prev.includes(id) ? prev.filter((colleagueId) => colleagueId !== id) : [...prev, id]
    )
  }

  async function handleSave(event?: FormEvent) {
    if (event) event.preventDefault()
    if (!currentUser) return

    setIsSubmitting(true)
    try {
      await updateUserProfile(currentUser.id, {
        domiciliu: domiciliu.trim(),
      })

      await updateUserPreferences(currentUser.id, {
        preferredLocation: selectedLocation,
        favoriteColleagueIds: selectedColleagueIds,
      })

      navigate("/")
    } catch (error) {
      console.error("Nu s-au putut salva preferințele:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSkip() {
    navigate("/")
  }

  return (
    <AuthLayout
      activeDot={2}
      headline={"Configurează-ți locul\nideal de muncă."}
      description="Personalizează experiența pentru a găsi locul perfect și a rămâne conectat cu echipa."
    >
      <div className="w-full rounded-3xl border border-border/60 bg-card p-6 shadow-xl sm:p-8 lg:p-10">
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Personalizează-ți preferințele
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Alege opțiunile rapide de mai jos
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {}
          <div>
            <label
              htmlFor="domiciliu"
              className="mb-1.5 block text-xs font-semibold text-foreground"
            >
              Adresă Domiciliu (pentru calcul traseu AI)
            </label>
            <Input
              id="domiciliu"
              type="text"
              placeholder="ex: București, Str. Nițu Vasile 58"
              value={domiciliu}
              onChange={(e) => setDomiciliu(e.target.value)}
              className="h-10 text-xs sm:text-sm"
            />
          </div>

          {}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Colegi favoriți
            </label>
            <div className="relative mb-2">
              <Input
                type="text"
                placeholder="Caută coleg..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pr-9 text-xs placeholder:text-muted-foreground"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {}
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border/80 bg-background/50 p-1">
              {filteredColleagues.length === 0 ? (
                <p className="p-3 text-center text-xs text-muted-foreground">
                  Niciun coleg găsit.
                </p>
              ) : (
                filteredColleagues.map((colleague) => {
                  const isSelected = selectedColleagueIds.includes(colleague.id)
                  return (
                    <button
                      key={colleague.id}
                      type="button"
                      onClick={() => toggleColleague(colleague.id)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-primary/15 font-medium text-foreground"
                          : "hover:bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{colleague.name}</span>
                      </div>
                      <Star
                        className={`h-4 w-4 transition-all ${
                          isSelected
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40 hover:text-muted-foreground"
                        }`}
                      />
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {}
          <div>
            <label
              htmlFor="preferredLocation"
              className="mb-1.5 block text-xs font-semibold text-foreground"
            >
              Locație Preferată
            </label>
            <div className="relative">
              <select
                id="preferredLocation"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-8 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>
                  Selectează o zonă...
                </option>
                {LOCATII_DISPONIBILE.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {isSubmitting ? "Se salvează..." : "Finalizează"}
          </Button>

          {}
          <button
            type="button"
            onClick={handleSkip}
            className="text-center text-xs text-muted-foreground hover:text-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors"
          >
            Sari peste acest pas
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}