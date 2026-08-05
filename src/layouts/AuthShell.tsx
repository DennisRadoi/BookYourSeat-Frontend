import type { ReactNode } from "react"

interface AuthShellProps {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
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
