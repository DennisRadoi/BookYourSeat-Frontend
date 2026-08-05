import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Moon, Sun, LogOut, User, Menu } from "lucide-react"
import { useLiveClock } from "@/hooks"

function DateTimeSubtitle() {
  const currentDateTime = useLiveClock()
  const formattedDateTime = currentDateTime.toLocaleString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  })
  return (
    <span className="flex items-center gap-1.5 text-sm text-[#4b5563] font-normal">
      {formattedDateTime}
    </span>
  )
}

function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-[20px] bg-[#10b981] px-1.5 py-px text-[11px] font-bold leading-[1.6] text-white">
      {children}
    </span>
  )
}

function ColleaguesSubtitle() {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[#4b5563]">
      <NavBadge>12</NavBadge> colegi în locație din 30
    </span>
  )
}

function NotificariSubtitle() {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[#4b5563]">
      <NavBadge>3</NavBadge> notificări necitite
    </span>
  )
}

function AnalyticsSubtitle() {
  const currentDateTime = useLiveClock()
  const month = currentDateTime.toLocaleString("ro-RO", { month: "long", year: "numeric" })
  return <span className="text-sm text-[#4b5563]">Raport pentru {month}</span>
}

function ContSubtitle() {
  return <span className="text-sm text-[#4b5563]">Administrează-ți profilul</span>
}

function SetariSubtitle() {
  return <span className="text-sm text-[#4b5563]">Preferințe aplicație</span>
}

function SeatsSubtitle() {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[#4b5563]">
      <NavBadge>8</NavBadge> locuri disponibile astăzi
    </span>
  )
}

type NavMeta = { title: string; subtitle: () => React.ReactNode }

const navMeta: Record<string, NavMeta> = {
  "/": { title: "Dashboard", subtitle: () => <DateTimeSubtitle /> },
  "/companie": { title: "Companie", subtitle: () => <ColleaguesSubtitle /> },
  "/notificari": { title: "Notificări", subtitle: () => <NotificariSubtitle /> },
  "/analytics": { title: "Analytics", subtitle: () => <AnalyticsSubtitle /> },
  "/cont": { title: "Contul meu", subtitle: () => <ContSubtitle /> },
  "/setari": { title: "Setări", subtitle: () => <SetariSubtitle /> },
  "/seats": { title: "Rezervare loc", subtitle: () => <SeatsSubtitle /> },
}

interface IconButtonProps {
  id?: string
  onClick?: () => void
  title?: string
  className?: string
  children: React.ReactNode
}

function IconButton({ id, onClick, title, className = "", children }: IconButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-[38px] w-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#4b5563] transition hover:bg-[#d1fae5] hover:text-[#059669] hover:border-[#059669] hover:shadow-[0_2px_8px_rgba(5,150,105,0.15)] ${className}`}
    >
      {children}
    </button>
  )
}

interface NavbarProps {
  onBurgerClick?: () => void
}

export default function Navbar({ onBurgerClick }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const meta = pathname.startsWith("/companie/")
    ? { title: "Profil", subtitle: () => <span className="navbar__subtitle">Info coleg</span> }
    : navMeta[pathname] ?? { title: "Book Your Seat", subtitle: () => null }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#e5e7eb] bg-[#f3f4f6] px-8 py-[18px] md:pl-14">
      <button
        id="navbar-burger-btn"
        onClick={onBurgerClick}
        aria-label="Deschide meniu"
        className="flex md:hidden h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white text-[#1f2937] transition hover:bg-[#d1fae5] hover:text-[#059669] hover:border-[#059669] hover:shadow-[0_2px_8px_rgba(5,150,105,0.20)]"
      >
        <Menu size={22} />
      </button>

      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-xl font-extrabold uppercase tracking-[0.5px] text-[#1f2937] leading-[1.2]">
          {meta.title}
        </h1>
        <div className="flex min-h-5 items-center gap-1.5">{meta.subtitle()}</div>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <IconButton
          id="navbar-theme-btn"
          onClick={() => setIsDarkMode((prev) => !prev)}
          title={isDarkMode ? "Mod luminos" : "Mod întunecat"}
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>

        <IconButton id="navbar-logout-btn" onClick={() => navigate("/")} title="Deconectare">
          <LogOut size={17} />
        </IconButton>

        <button
          id="navbar-account-btn"
          onClick={() => navigate("/cont")}
          title="Contul meu"
          aria-label="Contul meu"
          className="flex h-11 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#1f2937] transition hover:bg-[#d1fae5] hover:text-[#059669] hover:border-[#059669]"
        >
          <User size={19} />
        </button>
      </div>
    </header>
  )
}
