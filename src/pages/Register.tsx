import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" />
      <path d="M9 6.3a10.7 10.7 0 0 1 3-.3c6 0 9.5 6 9.5 6a18.8 18.8 0 0 1-4.1 4.8" />
      <path d="M6.4 8.4A18.3 18.3 0 0 0 2.5 12s3.5 6 9.5 6c1.7 0 3.2-.3 4.6-.8" />
    </svg>
  )
}

function PasswordToggle({
  isVisible,
  onToggle,
  label,
}: {
  isVisible: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {isVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
    </button>
  )
}

export default function Register() {
  const navigate = useNavigate()
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
    if (password.length < 8) {
      setError("Parola trebuie să aibă cel puțin 8 caractere.")
      return
    }
    if (!acceptedTerms) {
      setError("Trebuie să accepți termenii de utilizare.")
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: inlocuieste cu un apel real catre services/mockApi
      await new Promise((resolve) => setTimeout(resolve, 400))
      navigate("/")
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
      <div className="w-full rounded-[32px] border border-border/60 bg-card p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Creează-ți cont
          </p>
          <h2 className="font-sans text-2xl font-semibold text-foreground">
            Creează-ți cont
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            E nevoie doar de un minut.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full flex-1">
              <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
                className="h-12 w-full"
              />
            </div>
            <div className="w-full flex-1">
              <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
                className="h-12 w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
              className="h-12 w-full"
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
                  className="h-12 w-full pr-12"
                  aria-describedby="password-help"
                />
                <PasswordToggle
                  isVisible={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                  label={showPassword ? "Ascunde parola" : "Arată parola"}
                />
              </div>
              <p id="password-help" className="mt-1 text-xs text-muted-foreground">
                Minim 8 caractere, o literă mare și un număr.
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
                  className="h-12 w-full pr-12"
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
            <p id="form-error" className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-12 w-full rounded-full font-semibold shadow-sm"
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