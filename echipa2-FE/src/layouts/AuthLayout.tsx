import type { ReactNode } from "react"

interface AuthLayoutProps {
  activeDot?: 0 | 1 | 2
  children: ReactNode
  headline?: string
  description?: string
  variant?: "layout" | "shell"
}

const BRAND_HEADLINE = "Rezervă-ți locul\nînainte să ajungi la birou."

const BRAND_TEXT =
  "Vezi în timp real ce locuri sunt libere în cele două corpuri ale clădirii, la Parter, Etajul 1 sau Etajul 2, invită colegi și primești recomandări AI despre vreme și trafic."

export function AuthLayout({
  activeDot = 0,
  children,
  headline = BRAND_HEADLINE,
  description = BRAND_TEXT,
  variant = "layout",
}: AuthLayoutProps) {
  if (variant === "shell") {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="flex items-center gap-3 border-b border-border bg-card px-8 py-5 sm:px-10 lg:px-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
            <img src="/Logo.svg" alt="" className="h-8 w-8" />
          </div>
          <span className="text-lg font-bold uppercase tracking-[0.24em] text-foreground sm:text-xl">
            Book Your Seat
          </span>
        </header>

        <main className="flex min-h-[calc(100vh-77px)] items-center justify-center p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full min-w-0 flex-col lg:flex-row">
        <section className="flex min-h-[520px] flex-col justify-between bg-primary px-4 py-8 sm:px-6 lg:w-[60%] lg:flex-none lg:px-8 lg:py-12">
          <div className="flex items-center gap-3">
            <img src="/Logo2.svg" alt="Logo" className="h-10 w-auto sm:h-12" />
            <span className="text-xl font-bold tracking-[0.2em] text-primary-foreground">
              BOOK YOUR SEAT
            </span>
          </div>

          <div className="my-auto py-8 max-w-2xl">
            <div className="mb-5 h-12 w-12 rounded-xl border border-[var(--border)] bg-[var(--card)]" />
            <h1 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl lg:text-[3.25rem]">
              {headline}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--primary-foreground)] sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={
                    dot === activeDot
                      ? "h-2 w-8 rounded-full bg-[var(--card)]"
                      : "h-2 w-2 rounded-full bg-[var(--card)]/60"
                  }
                />
              ))}
            </div>

            <p className="max-w-md text-xs leading-relaxed text-[var(--primary-foreground)]">
              Aleea Tibleș 26, Sector 6 &middot; București, România | CUI 41251980, J40/77...
            </p>
          </div>
        </section>

        <aside className="flex flex-1 items-center justify-center bg-muted/30 px-6 py-10 sm:px-8 lg:w-[40%] lg:flex-none lg:px-10">
          <div className="w-full max-w-[540px]">{children}</div>
        </aside>
      </div>
    </div>
  )
}

export function AuthShell(props: Omit<AuthLayoutProps, "variant">) {
  return <AuthLayout {...props} variant="shell" />
}
