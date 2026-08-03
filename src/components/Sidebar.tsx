import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Bell,
  BarChart2,
  User,
  Settings,
  PanelLeft,
  CalendarCheck,
} from "lucide-react"

const navLinks = [
  { to: "/",            label: "Dashboard",  icon: Home      },
  { to: "/companie",    label: "Companie",   icon: Users     },
  { to: "/notificari",  label: "Notificari", icon: Bell      },
  { to: "/analytics",   label: "Analytics",  icon: BarChart2 },
]

const bottomLinks = [
  { to: "/cont",   label: "Cont",   icon: User     },
  { to: "/setari", label: "Setari", icon: Settings },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("sidebar-wrapper", collapsed && "sidebar-wrapper--collapsed")}>
      {/* ── Sidebar panel ───────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar__header">
          <div className="sidebar__logo-icon">
            <img src="/Logo.svg" alt="BYS logo" width={36} height={36} />
          </div>
          <span className="sidebar__logo-text">BOOK YOUR SEAT</span>
        </div>

        {/* CTA */}
        <div className="sidebar__cta-wrapper">
          <Link to="/seats" className="sidebar__cta">
            <CalendarCheck size={18} />
            {!collapsed && <span>Book a seat</span>}
          </Link>
        </div>

        {/* Main nav */}
        <nav className="sidebar__nav">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn("sidebar__link", active && "sidebar__link--active")}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} className="sidebar__link-icon" />
                {!collapsed && <span className="sidebar__link-label">{label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar__spacer" />
        <hr className="sidebar__divider" />

        {/* Bottom nav */}
        <nav className="sidebar__nav sidebar__nav--bottom">
          {bottomLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn("sidebar__link", active && "sidebar__link--active")}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} className="sidebar__link-icon" />
                {!collapsed && <span className="sidebar__link-label">{label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* ── Toggle — lives OUTSIDE the aside, never clipped ── */}
      <button
        className="sidebar__toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <PanelLeft size={18} />
      </button>
    </div>
  )
}
