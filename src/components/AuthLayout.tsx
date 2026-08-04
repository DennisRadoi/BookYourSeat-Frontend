
// AuthLayout.tsx
import type { ReactNode } from "react"

interface AuthLayoutProps {
  activeDot?: 0 | 1 | 2
  children: ReactNode
  headline?: string
  description?: string
}

const BRAND_HEADLINE = "Rezervă-ți locul\nînainte să ajungi la birou."

const BRAND_TEXT =
  "Vezi în timp real ce locuri sunt libere în cele două corpuri ale clădirii, la Parter, Etajul 1 sau Etajul 2, invită colegi și primești recomandări AI despre vreme și trafic."

export function AuthLayout({
  activeDot = 0,
  children,
  headline = BRAND_HEADLINE,
  description = BRAND_TEXT,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full min-w-0 flex-col lg:flex-row">
        {/* Panou Verde (60%) - Padding micsorat pe stanga (px-4 sm:px-6 lg:px-8) */}
        <section className="flex min-h-[520px] flex-col justify-between bg-primary px-4 py-8 sm:px-6 lg:w-[60%] lg:flex-none lg:px-8 lg:py-12">
          
          {/* Top Header */}
          <div className="flex items-center gap-3">
            <img src="/Logo2.svg" alt="Logo" className="h-10 w-auto sm:h-12" />
            <span className="text-xl font-bold tracking-[0.2em] text-primary-foreground">
              BOOK YOUR SEAT
            </span>
          </div>

          {/* Middle Content */}
          <div className="my-auto py-8 max-w-2xl">
            <div className="mb-5 h-12 w-12 rounded-xl border border-white/20 bg-white/15" />
            
            {/* Titlul refacut alb (text-primary-foreground / text-white) */}
            <h1 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl lg:text-[3.25rem]">
              {headline}
            </h1>
            
            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {description}
            </p>
          </div>

          {/* Footer Verde */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={
                    dot === activeDot
                      ? "h-2 w-8 rounded-full bg-white"
                      : "h-2 w-2 rounded-full bg-white/40"
                  }
                />
              ))}
            </div>
            
            <p className="max-w-md text-xs leading-relaxed text-white/70">
              Aleea Tibleș 26, Sector 6 &middot; București, România | CUI 41251980, J40/77...
            </p>
          </div>
        </section>

        {/* Panou Dreapta (40%) - Card de login generos */}
        <aside className="flex flex-1 items-center justify-center bg-muted/30 px-6 py-10 sm:px-8 lg:w-[40%] lg:flex-none lg:px-10">
          <div className="w-full max-w-[540px]">{children}</div>
        </aside>
      </div>
    </div>
  )
}