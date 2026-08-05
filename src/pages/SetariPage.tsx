import { Check, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const floors = ["Parter", "Etaj 1", "Etaj 2"]
const workspaceTypes = ["Lângă fereastră", "Zone liniștite", "Zone deschise", "Lângă cafenea", "Colțuri izolate"]
const weekdays = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]

export default function SetariPage() {
  const [floor, setFloor] = useState("Parter")
  const [workspace, setWorkspace] = useState(new Set(["Lângă fereastră", "Lângă cafenea"]))
  const [days, setDays] = useState(new Set(weekdays.slice(0, 5)))
  const [emailConfirmation, setEmailConfirmation] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [nearbyColleague, setNearbyColleague] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleValue(value: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) {
    setter((current) => {
      const next = new Set(current)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  function savePreferences() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section className="w-full max-w-[960px] text-[#27312f]">
      <div className="mb-5 flex flex-col gap-3 border-b border-[#e5e7e8] pb-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold">Setări</h2>
          <p className="mt-0.5 text-xs text-[#87908e]">Preferințele tale pentru aplicație</p>
        </div>
        <button
          type="button"
          onClick={savePreferences}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#08a477] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#078b65] focus:outline-none focus:ring-2 focus:ring-[#08a477] focus:ring-offset-2 sm:h-9 sm:w-auto"
        >
          {saved && <Check size={15} />}
          {saved ? "Salvat" : "Salvează"}
        </button>
      </div>

      <div className="grid max-w-[760px] gap-5 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <fieldset>
            <legend className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8a9291]">Preferințe muncă</legend>
            <div className="rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-4">
              <p className="text-xs font-medium text-[#87908e]">Floor preferat</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {floors.map((item) => (
                  <button key={item} type="button" onClick={() => setFloor(item)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${floor === item ? "bg-[#08a477] text-white" : "bg-[#f5f6f7] text-[#616b68] hover:bg-[#e8f6f0]"}`}>{item}</button>
                ))}
              </div>

              <p className="mt-4 text-xs font-medium text-[#87908e]">Tipuri de spații</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {workspaceTypes.map((item) => {
                  const selected = workspace.has(item)
                  return <button key={item} type="button" onClick={() => toggleValue(item, setWorkspace)} className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${selected ? "border-[#a8ead1] bg-[#e4fbf1] text-[#08a477]" : "border-[#e5e7e8] bg-white text-[#858d8b] hover:border-[#a8ead1]"}`}>{selected && "✓ "}{item}</button>
                })}
              </div>

              <p className="mt-4 text-xs font-medium text-[#87908e]">Zile obișnuite</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {weekdays.map((day) => <button key={day} type="button" onClick={() => toggleValue(day, setDays)} className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${days.has(day) ? "bg-[#08a477] text-white" : "bg-[#f0f1f3] text-[#8a9291]"}`}>{day}</button>)}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <label className="text-[10px] text-[#87908e]">Ora început<input type="time" aria-label="Ora început" className="mt-1 block h-8 w-full rounded-lg border border-[#e5e7e8] bg-[#f5f6f7] px-2 text-xs text-[#58615f] outline-none focus:border-[#08a477]" /></label>
                <label className="text-[10px] text-[#87908e]">Ora sfârșit<input type="time" aria-label="Ora sfârșit" className="mt-1 block h-8 w-full rounded-lg border border-[#e5e7e8] bg-[#f5f6f7] px-2 text-xs text-[#58615f] outline-none focus:border-[#08a477]" /></label>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8a9291]">Securitate</legend>
            <div className="rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-4">
              <PasswordField label="Parola curentă" placeholder="••••••••" showPassword={showPassword} onToggle={() => setShowPassword((show) => !show)} />
              <div className="mt-3"><PasswordField label="Parola nouă" placeholder="Minim 8 caractere" showPassword={showPassword} onToggle={() => setShowPassword((show) => !show)} /></div>
              <button type="button" className="mt-4 h-9 w-full rounded-lg bg-[#08a477] text-xs font-bold text-white transition hover:bg-[#078b65]">Schimbă parola</button>
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8a9291]">Notificări</legend>
          <div className="divide-y divide-[#eef0f1] rounded-xl bg-white px-3 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:px-4">
            <ToggleRow title="Confirmare rezervare pe email" description="Primești email la fiecare rezervare nouă" enabled={emailConfirmation} onChange={setEmailConfirmation} />
            <ToggleRow title="Reminder înainte de rezervare" description="Notificare cu 30 min înainte" enabled={dailyReminder} onChange={setDailyReminder} />
            <ToggleRow title="Coleg rezervă în apropiere" description="Când un coleg e în aceeași zonă cu tine" enabled={nearbyColleague} onChange={setNearbyColleague} />
          </div>
        </fieldset>
      </div>
    </section>
  )
}

function ToggleRow({ title, description, enabled, onChange }: { title: string; description: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex min-h-[61px] items-start justify-between gap-3 py-3 sm:items-center"><div className="min-w-0"><p className="text-xs font-semibold text-[#4c5653]">{title}</p><p className="mt-0.5 text-[10px] text-[#929997]">{description}</p></div><button type="button" role="switch" aria-checked={enabled} onClick={() => onChange(!enabled)} className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition sm:mt-0 ${enabled ? "bg-[#08a477]" : "bg-[#d9dcdf]"}`}><span className={`absolute top-1 size-3 rounded-full bg-white shadow transition ${enabled ? "left-5" : "left-1"}`} /></button></div>
}

function PasswordField({ label, placeholder, showPassword, onToggle }: { label: string; placeholder: string; showPassword: boolean; onToggle: () => void }) {
  return <label className="block text-[10px] text-[#87908e]">{label}<span className="relative mt-1 block"><input type={showPassword ? "text" : "password"} placeholder={placeholder} className="h-8 w-full rounded-lg border border-[#e5e7e8] bg-[#f5f6f7] px-2 pr-8 text-xs text-[#58615f] outline-none placeholder:text-[#a2a8a6] focus:border-[#08a477]" /><button type="button" onClick={onToggle} aria-label={showPassword ? "Ascunde parola" : "Arată parola"} className="absolute inset-y-0 right-2 text-[#a0a6a5]">{showPassword ? <EyeOff size={13} /> : <Eye size={13} />}</button></span></label>
}
