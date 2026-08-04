import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { PanelLeft, CalendarCheck } from "lucide-react"

// Small helper that renders an SVG from public/icons/
const SvgIcon = ({ src, alt, size = 20, className }: { src: string; alt: string; size?: number; className?: string }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
  />
)

const navLinks = [
  { to: "/",           label: "Dashboard",  iconSrc: "/icons/home.svg"       },
  { to: "/companie",   label: "Companie",   iconSrc: "/icons/companie.svg"   },
  { to: "/notificari", label: "Notificari", iconSrc: "/icons/notificari.svg" },
  { to: "/analytics",  label: "Analytics",  iconSrc: "/icons/Analytics.svg"  },
]

const bottomLinks = [
  { to: "/cont",   label: "Cont",   iconSrc: "/icons/cont.svg"     },
  { to: "/setari", label: "Setari", iconSrc: "/icons/settings.svg" },
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
          {navLinks.map(({ to, label, iconSrc }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn("sidebar__link", active && "sidebar__link--active")}
                title={collapsed ? label : undefined}
              >
                <SvgIcon src={iconSrc} alt={label} size={20} className="sidebar__link-icon" />
                {!collapsed && <span className="sidebar__link-label">{label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar__spacer" />
        <hr className="sidebar__divider" />

        {/* Bottom nav */}
        <nav className="sidebar__nav sidebar__nav--bottom">
          {bottomLinks.map(({ to, label, iconSrc }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn("sidebar__link", active && "sidebar__link--active")}
                title={collapsed ? label : undefined}
              >
                <SvgIcon src={iconSrc} alt={label} size={20} className="sidebar__link-icon" />
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
