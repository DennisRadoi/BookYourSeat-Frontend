import { useState, useEffect, type FormEvent, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Star, Camera, Phone, Building2, Calendar, MapPin, User as UserIcon } from "lucide-react"
import { Button, Input } from "@/components/ui"
import { getCurrentUser, updateUserProfile, updateUserPreferences } from "@/services"
import { colleagues } from "@/data/colleagues"
import type { User } from "@/types"

const LOCATII_DISPONIBILE = [
  "Parter - Săli de birou",
  "Etaj 1 - Săli de birou",
  "Etaj 2 - Săli de birou",
  "Corpul T1, Etaj 1 - Evenimente",
  "Corpul T1, Etaj 1 - Stand-up Chat room",
  "Corpul T1, Etaj 2 - Gaming",
  "Corpul T2, Etaj 1 - Sala 404",
]

const DEPARTAMENTE = [
  "Engineering",
  "Design",
  "Human Resources",
  "Marketing",
  "Sales",
  "Quality Assurance",
]

export default function Onboarding() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Informații Personale
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [department, setDepartment] = useState("")
  const [hireDate, setHireDate] = useState("")
  const [domiciliu, setDomiciliu] = useState("")

  // Preferințe Birou
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedColleagueIds, setSelectedColleagueIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
        setAvatarUrl(user.avatarUrl || null)
        setPhone(user.phone || "")
        setDepartment(user.department || "")
        setHireDate(user.hireDate || "")
        setDomiciliu(user.domiciliu || "")
      }
    }
    loadData()
  }, [])

  const filteredColleagues = colleagues.filter(
  (c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.department ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
)

  const toggleColleague = (id: number) => {
    setSelectedColleagueIds((prev) =>
      prev.includes(id) ? prev.filter((colleagueId) => colleagueId !== id) : [...prev, id],
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setAvatarUrl(imageUrl)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsSubmitting(true)
    try {
      await updateUserProfile(currentUser.id, {
        phone,
        department,
        hireDate,
        domiciliu,
        avatarUrl,
      })

      await updateUserPreferences(currentUser.id, {
        preferredLocation: selectedLocation,
        favoriteColleagueIds: selectedColleagueIds,
      })

      navigate("/")
    } catch (error) {
      console.error("Eroare la salvarea preferințelor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 space-y-8">
        
        {/* Antet */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Personalizează-ți profilul</h1>
          <p className="text-slate-500 text-sm">
            Completează detaliile tale și preferințele de lucru pentru a-ți optimiza experiența.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECȚIUNEA 1: Informații Personale */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b pb-2">
              1. Informații Personale
            </h2>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-slate-400 flex items-center justify-center cursor-pointer overflow-hidden bg-slate-50 transition-colors group"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-slate-400 group-hover:text-slate-500" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-emerald-600 hover:underline"
              >
                {avatarUrl ? "Schimbă poza de profil" : "Incarcă poză de profil"}
              </button>
            </div>

            {/* Grid 2 coloane pentru date de contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Număr de telefon
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="+40 7xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Departament
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Selectează departament</option>
                    {DEPARTAMENTE.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Data angajării
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Adresă domiciliu
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Oraș, Strada..."
                    value={domiciliu}
                    onChange={(e) => setDomiciliu(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECȚIUNEA 2: Preferințe Birou */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b pb-2">
              2. Preferințe Birou
            </h2>

            {/* Locație Preferată */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Locație / Zonă preferată în birou
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Selectează o zonă preferată</option>
                {LOCATII_DISPONIBILE.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Căutare Colegi Favoriți */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-700">
                Colegi favoriți
              </label>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cauta colegi după nume sau departament..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Lista derulabilă de colegi */}
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                {filteredColleagues.length > 0 ? (
                  filteredColleagues.map((colleague) => {
                    const isSelected = selectedColleagueIds.includes(colleague.id)
                    return (
                      <div
                        key={colleague.id}
                        onClick={() => toggleColleague(colleague.id)}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                          isSelected ? "bg-amber-50/50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 overflow-hidden">
                            {colleague.avatarUrl ? (
                              <img src={colleague.avatarUrl} alt={colleague.name} className="w-full h-full object-cover" />
                            ) : (
                              colleague.name[0]
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{colleague.name}</p>
                            <p className="text-xs text-slate-400">{colleague.department}</p>
                          </div>
                        </div>

                        <Star
                          className={`w-5 h-5 ${
                            isSelected ? "fill-amber-400 text-amber-400" : "text-slate-300"
                          }`}
                        />
                      </div>
                    )
                  })
                ) : (
                  <p className="p-4 text-center text-xs text-slate-400">Niciun coleg găsit.</p>
                )}
              </div>
            </div>
          </div>

          {/* Acțiuni Submit / Skip */}
          <div className="pt-4 space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {isSubmitting ? "Se salvează..." : "Finalizează Profilul"}
            </Button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Sari peste acest pas
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}