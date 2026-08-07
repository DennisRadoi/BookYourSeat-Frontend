import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { changeCurrentUserPassword, getUserSettings, updateUserSettings } from "@/services"
import { availableFloors, availableWorkspaceTypes, availableWeekdays } from "@/data"
import { PasswordField } from "@/components/common/PasswordField"
import { ToggleRow } from "./components/ToggleRow"
import { Button, PillButton } from "@/components/ui"

export default function SetariPage() {
  const [selectedFloor, setSelectedFloor] = useState("Parter")
  const [selectedWorkspaces, setSelectedWorkspaces] = useState(
    new Set(["Lângă fereastră", "Lângă cafenea"]),
  )
  const [selectedDays, setSelectedDays] = useState(new Set(availableWeekdays.slice(0, 5)))
  const [emailConfirmation, setEmailConfirmation] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [nearbyColleague, setNearbyColleague] = useState(false)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("18:00")
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getUserSettings()
        setEmailConfirmation(settings.notificationsEnabled)
        setDailyReminder(settings.autoReserve)
        setStartTime(settings.defaultStartTime)
        setEndTime(settings.defaultEndTime)
      } catch (error) {
        console.error("Eroare la încărcarea setărilor:", error)
      }
    }

    loadSettings()
  }, [])

  function toggleSetItem(
    item: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) {
    setter((current) => {
      const next = new Set(current)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }

  async function handleSavePreferences() {
    try {
      await updateUserSettings({
        notificationsEnabled: emailConfirmation,
        autoReserve: dailyReminder,
        defaultStartTime: startTime,
        defaultEndTime: endTime,
      })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2500)
    } catch (error) {
      console.error("Eroare la salvarea setărilor:", error)
    }
  }

  async function handleChangePassword() {
    try {
      await changeCurrentUserPassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setPasswordMessage("Parola a fost schimbată cu succes.")
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Parola nu a putut fi schimbată.")
    }
  }

  return (
    <section className="w-full max-w-[960px] text-[var(--foreground)]">
      <div className="mb-5 flex flex-col gap-3 border-b border-[var(--border)] pb-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-[var(--foreground)]">Setări</h2>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">Preferințele tale pentru aplicație</p>
        </div>
        <Button
          type="button"
          onClick={handleSavePreferences}
          leftIcon={isSaved ? <Check size={15} /> : undefined}
          size="sm"
          className="w-full sm:w-auto font-bold"
        >
          {isSaved ? "Salvat" : "Salvează"}
        </Button>
      </div>

      <div className="grid max-w-[760px] gap-5 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <fieldset>
            <legend className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
              Preferințe muncă
            </legend>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Floor preferat</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableFloors.map((item) => (
                  <PillButton
                    key={item}
                    type="button"
                    size="sm"
                    isActive={selectedFloor === item}
                    onClick={() => setSelectedFloor(item)}
                  >
                    {item}
                  </PillButton>
                ))}
              </div>

              <p className="mt-4 text-xs font-medium text-[var(--muted-foreground)]">Tipuri de spații</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableWorkspaceTypes.map((item) => {
                  const selected = selectedWorkspaces.has(item)
                  return (
                    <PillButton
                      key={item}
                      type="button"
                      size="xs"
                      isActive={selected}
                      onClick={() => toggleSetItem(item, setSelectedWorkspaces)}
                    >
                      {selected && "✓ "}
                      {item}
                    </PillButton>
                  )
                })}
              </div>

              <p className="mt-4 text-xs font-medium text-[var(--muted-foreground)]">Zile obișnuite</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {availableWeekdays.map((day) => (
                  <PillButton
                    key={day}
                    type="button"
                    size="xs"
                    isActive={selectedDays.has(day)}
                    onClick={() => toggleSetItem(day, setSelectedDays)}
                    className="h-7 w-7 min-w-0 p-0 text-[10px] font-bold"
                  >
                    {day}
                  </PillButton>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <label className="text-[10px] text-[var(--muted-foreground)]">
                  Ora început
                  <input
                    type="time"
                    aria-label="Ora început"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="mt-1 block h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  />
                </label>
                <label className="text-[10px] text-[var(--muted-foreground)]">
                  Ora sfârșit
                  <input
                    type="time"
                    aria-label="Ora sfârșit"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="mt-1 block h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  />
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
              Securitate
            </legend>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:p-4">
              <PasswordField
                label="Parola curentă"
                placeholder="••••••••"
                showPassword={showPassword}
                onToggle={() => setShowPassword((show) => !show)}
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <div className="mt-3">
                <PasswordField
                  label="Parola nouă"
                  placeholder="Minim 8 caractere"
                  showPassword={showPassword}
                  onToggle={() => setShowPassword((show) => !show)}
                  value={newPassword}
                  onChange={setNewPassword}
                />
              </div>
              <Button
                type="button"
                onClick={handleChangePassword}
                className="mt-4 w-full text-xs font-bold"
                size="sm"
              >
                Schimbă parola
              </Button>
              {passwordMessage && <p role="status" className="mt-2 text-[10px] text-[var(--muted-foreground)]">{passwordMessage}</p>}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
            Notificări
          </legend>
          <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)] sm:px-4">
            <ToggleRow
              title="Confirmare rezervare pe email"
              description="Primești email la fiecare rezervare nouă"
              enabled={emailConfirmation}
              onChange={setEmailConfirmation}
            />
            <ToggleRow
              title="Reminder înainte de rezervare"
              description="Notificare cu 30 min înainte"
              enabled={dailyReminder}
              onChange={setDailyReminder}
            />
            <ToggleRow
              title="Coleg rezervă în apropiere"
              description="Când un coleg e în aceeași zonă cu tine"
              enabled={nearbyColleague}
              onChange={setNearbyColleague}
            />
          </div>
        </fieldset>
      </div>
    </section>
  )
}
