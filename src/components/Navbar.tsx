import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Moon, Sun, LogOut, User, Menu } from "lucide-react"

/* ─── Live clock ─────────────────────────────────────────────── */
function useLiveDateTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

/* ─── Subtitle components ────────────────────────────────────── */
function DateTimeSubtitle() {
  const now = useLiveDateTime()
  const formatted = now.toLocaleString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  })
  return <span className="navbar__subtitle">{formatted}</span>
}

function ColleaguesSubtitle() {
  const inOffice = 12
  const total = 30
  return (
    <span className="navbar__subtitle">
      <span className="navbar__subtitle-badge">{inOffice}</span>
      {" "}colegi în locație din {total}
    </span>
  )
}

function NotificariSubtitle() {
  const unread = 3
  return (
    <span className="navbar__subtitle">
      <span className="navbar__subtitle-badge">{unread}</span>
      {" "}notificări necitite
    </span>
  )
}

function AnalyticsSubtitle() {
  const now = useLiveDateTime()
  const month = now.toLocaleString("ro-RO", { month: "long", year: "numeric" })
  return <span className="navbar__subtitle">Raport pentru {month}</span>
}

function ContSubtitle() {
  return <span className="navbar__subtitle">Administrează-ți profilul</span>
}

function SetariSubtitle() {
  return <span className="navbar__subtitle">Preferințe aplicație</span>
}

function SeatsSubtitle() {
  const available = 8
  return (
    <span className="navbar__subtitle">
      <span className="navbar__subtitle-badge">{available}</span>
      {" "}locuri disponibile astăzi
    </span>
  )
}

/* ─── Route → title + subtitle map ──────────────────────────── */
type NavMeta = { title: string; subtitle: () => React.ReactNode }

const navMeta: Record<string, NavMeta> = {
  "/":            { title: "Dashboard",     subtitle: () => <DateTimeSubtitle />    },
  "/companie":    { title: "Companie",      subtitle: () => <ColleaguesSubtitle />  },
  "/notificari":  { title: "Notificări",    subtitle: () => <NotificariSubtitle />  },
  "/analytics":   { title: "Analytics",    subtitle: () => <AnalyticsSubtitle />   },
  "/cont":        { title: "Contul meu",    subtitle: () => <ContSubtitle />        },
  "/setari":      { title: "Setări",        subtitle: () => <SetariSubtitle />      },
  "/seats":       { title: "Rezervare loc", subtitle: () => <SeatsSubtitle />       },
}

/* ─── Navbar ─────────────────────────────────────────────────── */
interface NavbarProps {
  onBurgerClick?: () => void
}

export default function Navbar({ onBurgerClick }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)

  const meta = pathname.startsWith("/companie/")
    ? { title: "Profil", subtitle: () => <span className="navbar__subtitle">Info coleg</span> }
    : navMeta[pathname] ?? { title: "Book Your Seat", subtitle: () => null }

  function handleLogout() {
    navigate("/")
  }

  return (
    <header className="navbar">
      {/* Burger button — only visible on mobile */}
      <button
        id="navbar-burger-btn"
        className="navbar__burger"
        onClick={onBurgerClick}
        aria-label="Deschide meniu"
        title="Meniu"
      >
        <Menu size={22} />
      </button>

      {/* Left — title + subtitle */}
      <div className="navbar__left">
        <h1 className="navbar__title">{meta.title}</h1>
        <div className="navbar__subtitle-row">{meta.subtitle()}</div>
      </div>

      {/* Right — 3 circle icon buttons */}
      <div className="navbar__actions">
        <button
          id="navbar-theme-btn"
          className="navbar__icon-btn"
          onClick={() => setDark((d) => !d)}
          title={dark ? "Mod luminos" : "Mod întunecat"}
          aria-label="Schimbare temă"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          id="navbar-logout-btn"
          className="navbar__icon-btn"
          onClick={handleLogout}
          title="Deconectare"
          aria-label="Deconectare"
        >
          <LogOut size={17} />
        </button>

        <button
          id="navbar-account-btn"
          className="navbar__icon-btn navbar__icon-btn--account"
          onClick={() => navigate("/cont")}
          title="Contul meu"
          aria-label="Contul meu"
        >
          <User size={19} />
        </button>
      </div>
    </header>
  )
}
