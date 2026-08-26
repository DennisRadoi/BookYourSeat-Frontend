import { useEffect, useState } from "react"
import PhoneInput, { type Country } from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import { getExampleNumber, parsePhoneNumber } from "libphonenumber-js/max"
import examples from "libphonenumber-js/examples.mobile.json"
import "react-phone-number-input/style.css"

interface PhoneNumberFieldProps { value: string; disabled?: boolean; onChange: (value: string) => void }

export function PhoneNumberField({ value, disabled, onChange }: PhoneNumberFieldProps) {
  const [country, setCountry] = useState<Country>("RO")
  let requiredDigits: number | undefined
  try {
    requiredDigits = getExampleNumber(country, examples)?.nationalNumber.length
  } catch {
    requiredDigits = undefined
  }
  useEffect(() => {
    try {
      const detected = value ? parsePhoneNumber(value)?.country : undefined
      if (detected) setCountry(detected)
    } catch {
      // Keep the currently selected country while the number is incomplete.
    }
  }, [value])
  return <div className="mt-1"><PhoneInput international defaultCountry="RO" flags={flags} value={value || undefined} disabled={disabled} onCountryChange={(next) => next && setCountry(next)} onChange={(next) => onChange(next || "")} className="h-11 rounded-md border border-input bg-background px-3 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2" numberInputProps={{ className: "min-w-0 bg-transparent px-2 text-sm text-foreground outline-none", "aria-label": "Număr de telefon" }} countrySelectProps={{ "aria-label": "Țară și prefix" }} /><p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{requiredDigits ? `Numărul mobil pentru țara selectată are de regulă ${requiredDigits} cifre, fără prefix.` : "Introdu un număr valid pentru țara selectată."}</p></div>
}
