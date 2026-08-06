import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { AuthShell } from "@/layouts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email) {
      setError("Introdu adresa de email.")
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: inlocuieste cu un apel real catre services/mockApi
      // ex: await requestPasswordReset(email)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsSent(true)
    } catch {
      setError("Nu am gasit niciun cont cu acest email.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSent) {
    return (
      <AuthShell>
        <div className="w-full max-w-125 rounded-[28px] border border-border/60 bg-card p-10 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-11">
          <div className="mx-auto mb-5 flex h-15 w-15 items-center justify-center rounded-2xl bg-accent">
            <CheckCircle2 className="h-8 w-8 text-accent-foreground" strokeWidth={1.75} />
          </div>

          <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">
            Verifica emailul
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            Am trimis un link de resetare catre
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>

          <Button asChild className="mb-4 h-11 w-full rounded-full font-semibold">
            <a href="mailto:">Deschide aplicatia de email</a>
          </Button>

          <p className="text-sm text-muted-foreground">
            Nu a ajuns emailul?{" "}
            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="font-semibold text-primary hover:underline"
            >
              Retrimite
            </button>
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="w-full max-w-125 rounded-[28px] border border-border/60 bg-card p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-11">
        <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">
          Ai uitat parola?
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Iti trimitem un link de resetare pe emailul de companie.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Email companie
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nume@companie.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
            className="h-12 w-full rounded-full font-semibold"
          >
            {isSubmitting ? "Se trimite..." : "Trimite link de resetare"}
          </Button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
            &larr; Inapoi la autentificare
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}