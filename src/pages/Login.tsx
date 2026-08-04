// import { useState, type FormEvent } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { AuthLayout } from "@/components/AuthLayout"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export default function Login() {
//   const navigate = useNavigate()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setError(null)

//     if (!email || !password) {
//       setError("Completează emailul și parola.")
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       // TODO: inlocuieste cu un apel real catre services/mockApi
//       // ex: await login(email, password)
//       await new Promise((resolve) => setTimeout(resolve, 400))
//       navigate("/")
//     } catch {
//       setError("Email sau parolă incorecte.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <AuthLayout
//       activeDot={0}
//       headline={"Rezervă-ți locul\nînainte să ajungi la birou."}
//       description="Vezi în timp real ce locuri sunt libere în cele două corpuri ale clădirii, la Parter, Etajul 1 sau Etajul 2, invită colegi și primești recomandări AI despre vreme și trafic."
//     >
//       <div className="w-full rounded-[32px] border border-border/60 bg-card p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
//         <div className="mb-6">
//           <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
//             Autentificare
//           </p>
//           <h2 className="font-sans text-2xl font-semibold text-foreground">
//             Bine ai revenit
//           </h2>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Autentifică-te cu contul de companie.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div>
//             <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
//               Email companie
//             </label>
//             <Input
//               id="email"
//               type="email"
//               autoComplete="email"
//               placeholder="nume@companie.com"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               className="h-12 w-full"
//             />
//           </div>

//           <div>
//             <div className="mb-1.5 flex items-center justify-between gap-2">
//               <label htmlFor="password" className="block text-xs font-medium text-muted-foreground">
//                 Parolă
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-2 transition hover:text-primary/80"
//               >
//                 Ai uitat parola?
//               </Link>
//             </div>
//             <Input
//               id="password"
//               type="password"
//               autoComplete="current-password"
//               placeholder="********"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               className="h-12 w-full"
//             />
//           </div>

//           {error && (
//             <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
//               {error}
//             </p>
//           )}

//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="mt-1 h-12 w-full rounded-full font-semibold shadow-sm"
//           >
//             {isSubmitting ? "Se autentifică..." : "Intră în cont"}
//           </Button>
//         </form>

//         <div className="my-6 flex items-center gap-3">
//           <div className="h-px flex-1 bg-border" />
//           <span className="text-xs text-muted-foreground">sau</span>
//           <div className="h-px flex-1 bg-border" />
//         </div>

//         <p className="text-center text-sm text-muted-foreground">
//           Nu ai cont?{" "}
//           <Link to="/register" className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 transition hover:text-primary/80">
//             Creează-ți cont
//           </Link>
//         </p>
//       </div>
//     </AuthLayout>
//   )
// }

// Login.tsx
import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Completează emailul și parola.")
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      navigate("/")
    } catch {
      setError("Email sau parolă incorecte.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout activeDot={0}>
      <div className="w-full rounded-3xl border border-border/60 bg-card p-8 shadow-xl sm:p-10 lg:p-12">
        
        {/* Header Formular - Text mărit */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Autentificare
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Bine ai revenit
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Autentifică-te cu contul de companie.
          </p>
        </div>

        {/* Formular - Text inputuri și label-uri mărite */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Email companie
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nume@companie.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-14 px-4 text-lg shadow-sm"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor="password" className="block text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Parolă
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:text-primary/80"
              >
                Ai uitat parola?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-14 px-4 text-lg shadow-sm"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 p-3.5 text-sm font-semibold text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-14 w-full rounded-full text-lg font-bold shadow-md transition-transform active:scale-[0.99]"
          >
            {isSubmitting ? "Se autentifică..." : "Intră în cont"}
          </Button>
        </form>

        {/* Separator */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">sau</span>
          <div className="h-px flex-1 bg-border/80" />
        </div>

        {/* Footer Card - Text mărit */}
        <p className="text-center text-lg text-muted-foreground">
          Nu ai cont?{" "}
          <Link
            to="/register"
            className="font-bold text-primary underline decoration-primary/40 underline-offset-4 hover:text-primary/80"
          >
            Creează-ți cont
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}