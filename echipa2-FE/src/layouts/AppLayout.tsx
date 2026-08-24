import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar
        mobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {isMobileMenuOpen && (
        <div
          className="animate-fade-in-overlay fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Navbar onBurgerClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
