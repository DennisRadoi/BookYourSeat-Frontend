import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Moon, Sun, LogOut, User, Menu } from "lucide-react"
import { useLiveClock } from "@/hooks"
import { IconButton } from "@/components/ui"
import { useTheme } from "@/hooks/useTheme"
import { getActiveColleagueCount, getNotifications } from "@/services"

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
    <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] font-normal">
      {formattedDateTime}
    </span>
  )
}

function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-[20px] bg-[var(--primary)] px-1.5 py-px text-[11px] font-bold leading-[1.6] text-[var(--primary-foreground)]">
      {children}
    </span>
  )
}

function ColleaguesSubtitle() {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
      <NavBadge>12</NavBadge> colegi în locație din 30
    </span>
  )
}

void ColleaguesSubtitle

function NotificariSubtitle() {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
      <NavBadge>3</NavBadge> notificări necitite
    </span>
  )
}

function AnalyticsSubtitle() {
  const currentDateTime = useLiveClock()
  const month = currentDateTime.toLocaleString("ro-RO", { month: "long", year: "numeric" })
  return <span className="text-sm text-[var(--muted-foreground)]">Raport pentru {month}</span>
}

function ContSubtitle() {
  return <span className="text-sm text-[var(--muted-foreground)]">Administrează-ți profilul</span>
}

function SetariSubtitle() {
  return <span className="text-sm text-[var(--muted-foreground)]">Preferințe aplicație</span>
}

function SeatsSubtitle() {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
      <NavBadge>8</NavBadge> locuri disponibile astăzi
    </span>
  )
}

type NavMeta = { title: string; subtitle: () => React.ReactNode }

const navMeta: Record<string, NavMeta> = {
  "/": { title: "Dashboard", subtitle: () => <DateTimeSubtitle /> },
  "/companie": { title: "Companie", subtitle: () => null },
  "/notificari": { title: "Notificări", subtitle: () => <NotificariSubtitle /> },
  "/analytics": { title: "Analytics", subtitle: () => <AnalyticsSubtitle /> },
  "/cont": { title: "Contul meu", subtitle: () => <ContSubtitle /> },
  "/setari": { title: "Setări", subtitle: () => <SetariSubtitle /> },
  "/seats": { title: "Rezervare loc", subtitle: () => <SeatsSubtitle /> },
}

interface NavbarProps {
  onBurgerClick?: () => void
}

export default function Navbar({ onBurgerClick }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isDark, toggle, setLight } = useTheme()
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [activeColleagues, setActiveColleagues] = useState(0)

  useEffect(() => {
    if (pathname === "/notificari") {
      getNotifications()
        .then((notifications) => setUnreadNotifications(notifications.filter((notification) => notification.isUnread).length))
        .catch(() => setUnreadNotifications(0))
    }
    if (pathname === "/companie") {
      getActiveColleagueCount()
        .then(setActiveColleagues)
        .catch(() => setActiveColleagues(0))
    }
  }, [pathname])

  // keep backwards-compatible meta detection
  const meta = pathname.startsWith("/companie/")
    ? { title: "Profil", subtitle: () => <span className="navbar__subtitle">Info coleg</span> }
    : navMeta[pathname] ?? { title: "Book Your Seat", subtitle: () => null }
  const subtitle = pathname === "/notificari"
    ? <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]"><NavBadge>{unreadNotifications}</NavBadge> notificări necitite</span>
    : pathname === "/companie"
    ? <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]"><NavBadge>{activeColleagues}</NavBadge> colegi activi</span>
    : meta.subtitle()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)] px-8 py-[18px] md:pl-14">
      <IconButton
        id="navbar-burger-btn"
        onClick={onBurgerClick}
        aria-label="Deschide meniu"
        className="flex md:hidden h-10 w-10 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
      >
        <Menu size={22} />
      </IconButton>

      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-xl font-extrabold uppercase tracking-[0.5px] text-[var(--foreground)] leading-[1.2]">
          {meta.title}
        </h1>
        {subtitle && <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">{subtitle}</div>}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <IconButton
          id="navbar-theme-btn"
          onClick={() => toggle()}
          title={isDark ? "Mod luminos" : "Mod întunecat"}
          className="border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>

        <IconButton
          id="navbar-logout-btn"
          onClick={() => {
            // clear auth keys and reset theme via provider
            if (typeof window !== "undefined") {
              try { localStorage.removeItem("authToken") } catch (e) {}
              try { localStorage.removeItem("refreshToken") } catch (e) {}
              try { localStorage.removeItem("user") } catch (e) {}
              try { localStorage.removeItem("auth") } catch (e) {}
              try { sessionStorage.clear() } catch (e) {}
            }

            // reset theme so login starts in light mode
            setLight()
            navigate("/login")
          }}
          title="Deconectare"
          className="border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
        >
          <LogOut size={17} />
        </IconButton>

        <IconButton
          id="navbar-account-btn"
          onClick={() => navigate("/cont")}
          title="Contul meu"
          aria-label="Contul meu"
          className="h-11 w-11 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
        >
          <User size={19} />
        </IconButton>
      </div>
    </header>
  )
}
