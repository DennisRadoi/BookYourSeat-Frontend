import { useState, type FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AuthShell } from "@/layouts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetForgottenPassword } from "@/services"
import { isValidPassword, passwordRequirementsMessage } from "@/lib/validation"

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // in productie, emailul (si un token) vin din link-ul primit pe email, ex:
  // /reset-password?token=xxxx&email=nume@companie.com
  const email = searchParams.get("email") ?? "contul tau"
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!isValidPassword(password)) {
      setError(passwordRequirementsMessage)
      return
    }
    if (password !== confirmPassword) {
      setError("Parolele nu coincid.")
      return
    }
    if (!token) {
      setError("Linkul de resetare este invalid sau incomplet.")
      return
    }

    setIsSubmitting(true)
    try {
      await resetForgottenPassword(token, password)
      navigate("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Parola nu a putut fi resetată.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-[500px] rounded-[28px] border border-border/60 bg-card p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-11">
        <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">
          Seteaza o parola noua
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Pentru <span className="font-semibold text-foreground">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Parola noua
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Minim 8 caractere, o cifra si un simbol
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Confirma parola noua
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="********"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-12 w-full"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full rounded-full font-semibold"
          >
            {isSubmitting ? "Se salveaza..." : "Salveaza parola noua"}
          </Button>
        </form>
      </div>
    </AuthShell>
  )
}
