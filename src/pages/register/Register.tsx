import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { AuthLayout } from "@/layouts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordToggle } from "./components/PasswordToggle"
import { register } from "@/services/authService"
import { isValidPassword } from "@/lib/validation"

export default function Register() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!firstName || !lastName || !email || !password) {
      setError("Completează toate câmpurile.")
      return
    }
    if (password !== confirmPassword) {
      setError("Parolele nu coincid.")
      return
    }
    if (!isValidPassword(password)) {
      setError("Parola trebuie să aibă cel puțin 8 caractere din care cel puțin o literă, o cifră și un simbol.")
      return
    }
    if (!acceptedTerms) {
      setError("Trebuie să accepți termenii de utilizare.")
      return
    }

    setIsSubmitting(true)
    try {
      await register({ firstName, lastName, email, password })
      window.location.assign("/onboarding")
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare. Încearcă din nou.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      activeDot={1}
      headline={"Alătură-te echipei\nîn câteva secunde."}
      description="Folosește adresa de email a companiei. Contul tău va fi verificat automat după domeniu și vei putea rezerva un loc din prima zi."
    >
      <div className="w-full rounded-3xl border border-border/60 bg-card p-8 shadow-xl sm:p-10 lg:p-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Creează-ți cont
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Creează-ți cont
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            E nevoie doar de un minut.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full flex-1">
              <label htmlFor="firstName" className="mb-2 block text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Prenume
              </label>
              <Input
                id="firstName"
                name="given-name"
                type="text"
                autoComplete="given-name"
                placeholder="Claudiu"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-14 w-full px-4 text-lg shadow-sm"
              />
            </div>
            <div className="w-full flex-1">
              <label htmlFor="lastName" className="mb-2 block text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Nume
              </label>
              <Input
                id="lastName"
                name="family-name"
                type="text"
                autoComplete="family-name"
                placeholder="Ionescu"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-14 w-full px-4 text-lg shadow-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Email companie
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nume@companie.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-14 w-full px-4 text-lg shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full flex-1">
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Parolă
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full pr-12 px-4 text-lg shadow-sm"
                  aria-describedby="password-help"
                />
                <PasswordToggle
                  isVisible={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                  label={showPassword ? "Ascunde parola" : "Arată parola"}
                />
              </div>
              <p id="password-help" className="mt-1 text-xs text-muted-foreground">
                Minim 8 caractere, o literă, o cifră și un simbol.
              </p>
            </div>
            <div className="w-full flex-1">
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Confirmă parola
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-14 w-full pr-12 px-4 text-lg shadow-sm"
                />
                <PasswordToggle
                  isVisible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((value) => !value)}
                  label={showConfirmPassword ? "Ascunde parola" : "Arată parola"}
                />
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              Sunt de acord cu{" "}
              <a
                href="#terms"
                className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 transition hover:text-primary/80"
              >
                Termenii de utilizare
              </a>{" "}
              și{" "}
              <a
                href="#privacy"
                className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 transition hover:text-primary/80"
              >
                Politica de confidențialitate
              </a>
            </span>
          </label>

          {error && (
            <p id="form-error" className="rounded-lg bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-14 w-full rounded-full bg-primary text-[var(--primary-foreground)] font-semibold shadow-sm"
          >
            {isSubmitting ? "Se creează contul..." : "Creează cont"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ai deja cont?{" "}
          <Link to="/login" className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 transition hover:text-primary/80">
            Intră în cont
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
