import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/utils"
import { PanelLeft, CalendarCheck, X } from "lucide-react"

interface SvgIconProps {
  src: string
  alt: string
  size?: number
  className?: string
}

function SvgIcon({ src, alt, size = 20, className }: SvgIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  )
}

const navLinks = [
  { to: "/", label: "Dashboard", iconSrc: "/icons/home.svg" },
  { to: "/companie", label: "Companie", iconSrc: "/icons/companie.svg" },
  { to: "/notificari", label: "Notificari", iconSrc: "/icons/notificari.svg" },
  { to: "/analytics", label: "Analytics", iconSrc: "/icons/Analytics.svg" },
]

const bottomLinks = [
  { to: "/cont", label: "Cont", iconSrc: "/icons/cont.svg" },
  { to: "/setari", label: "Setari", iconSrc: "/icons/settings.svg" },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { pathname } = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  function handleLinkClick() {
    onMobileClose?.()
  }

  return (
    <div
      className={cn(
        "relative flex-shrink-0 sidebar-transition",
        isCollapsed ? "w-[72px]" : "w-60",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-[280px!important] max-md:sidebar-transform-transition",
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
      )}
    >
      <aside className="flex h-screen w-full flex-col overflow-hidden border-r border-[#e5e7eb] bg-[#f3f4f6] px-3 py-5 box-border">
        <div className="mb-5 flex min-h-[44px] items-center gap-2">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
            <img src="/Logo.svg" alt="BYS logo" width={36} height={36} />
          </div>

          <span
            className={cn(
              "flex-1 overflow-hidden whitespace-nowrap text-xs font-bold tracking-[0.6px] text-[#1f2937] transition-[opacity,max-width] duration-300",
              isCollapsed ? "max-w-0 opacity-0 max-md:max-w-[200px] max-md:opacity-100" : "max-w-[140px] opacity-100",
            )}
          >
            BOOK YOUR SEAT
          </span>

          <button
            className="ml-auto hidden max-md:flex items-center justify-center h-8 w-8 rounded-lg border border-[#e5e7eb] bg-transparent text-[#6b7280] cursor-pointer transition hover:bg-[#d1fae5] hover:text-[#059669]"
            onClick={onMobileClose}
            aria-label="Închide meniu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-3">
          <Link
            to="/seats"
            onClick={handleLinkClick}
            className="flex w-full items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[10px] bg-[#059669] px-4 py-[10px] text-sm font-semibold text-white no-underline transition hover:bg-[#047857] hover:shadow-[0_4px_14px_rgba(5,150,105,0.30)]"
          >
            <CalendarCheck size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Book a seat</span>}
          </Link>
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map(({ to, label, iconSrc }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={handleLinkClick}
                title={isCollapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-[10px] px-3 py-[10px] text-sm font-medium no-underline transition-colors",
                  isActive
                    ? "bg-[#d1fae5] font-semibold text-[#059669]"
                    : "text-[#1f2937] hover:bg-[#d1fae5]/50 hover:text-[#059669]",
                )}
              >
                <SvgIcon src={iconSrc} alt={label} size={20} className="flex-shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden transition-[opacity] duration-300",
                    isCollapsed ? "opacity-0 w-0 max-md:opacity-100 max-md:w-auto" : "opacity-100",
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />
        <hr className="my-[10px] border-none border-t border-[#e5e7eb]" />

        <nav className="mb-2 flex flex-col gap-1">
          {bottomLinks.map(({ to, label, iconSrc }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={handleLinkClick}
                title={isCollapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-[10px] px-3 py-[10px] text-sm font-medium no-underline transition-colors",
                  isActive
                    ? "bg-[#d1fae5] font-semibold text-[#059669]"
                    : "text-[#1f2937] hover:bg-[#d1fae5]/50 hover:text-[#059669]",
                )}
              >
                <SvgIcon src={iconSrc} alt={label} size={20} className="flex-shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden transition-[opacity] duration-300",
                    isCollapsed ? "opacity-0 w-0 max-md:opacity-100 max-md:w-auto" : "opacity-100",
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <button
        className={cn(
          "absolute top-4 -right-[40px] z-20 hidden md:flex",
          "h-[30px] w-[30px] items-center justify-center rounded-lg",
          "border border-[#e5e7eb] bg-[#f3f4f6] shadow-[2px_0_6px_rgba(0,0,0,0.06)]",
          "cursor-pointer text-[#6b7280] transition hover:bg-[#059669] hover:text-white hover:border-[#059669] hover:shadow-[0_2px_10px_rgba(5,150,105,0.35)]",
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <PanelLeft size={18} />
      </button>
    </div>
  )
}
