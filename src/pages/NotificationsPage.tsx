import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/utils"
import {
  Star,
  Monitor,
  Bell,
  CheckCircle2,
  Users,
  CloudRain,
  Repeat,
  X,
  type LucideIcon,
} from "lucide-react"
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/services"
import type { Notification, NotificationType } from "@/types"

const notificationIconMap: Record<NotificationType, LucideIcon> = {
  favorite: Star,
  freed: Monitor,
  invite: Bell,
  confirmed: CheckCircle2,
  team: Users,
  weather: CloudRain,
  recurring: Repeat,
  canceled: Bell,
  verified: CheckCircle2,
}

export default function NotificationsPage() {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([])
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications()
        setNotificationsList(data)
      } catch (error) {
        console.error("Eroare la încărcarea notificărilor:", error)
      }
    }

    loadNotifications()
  }, [])

  async function handleMarkAllAsRead() {
    try {
      const updated = await markAllNotificationsAsRead()
      setNotificationsList(updated)
    } catch (error) {
      console.error("Eroare la marcarea notificărilor ca citite:", error)
    }
  }

  async function handleNotificationClick(notif: Notification) {
    setSelectedNotif(notif)
    if (notif.isUnread) {
      try {
        const updated = await markNotificationAsRead(notif.id)
        setNotificationsList((current) =>
          current.map((n) => (n.id === updated.id ? updated : n)),
        )
      } catch (error) {
        console.error("Eroare la marcarea notificării:", error)
      }
    }
  }

  const totalNotifications = notificationsList.length
  const unreadCount = notificationsList.filter((n) => n.isUnread).length

  return (
    <div className="w-full bg-[var(--background)]">
      <Card className="border border-[var(--border)] shadow-[0_1px_6px_rgba(0,0,0,0.04)] overflow-hidden bg-[var(--card)] rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border)] bg-[var(--card)] py-4 px-6 space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
              {totalNotifications} notificări
            </CardTitle>
            <span className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">
              {unreadCount} necitite
            </span>
          </div>

          <Button
            variant="link"
            onClick={handleMarkAllAsRead}
            className="text-[var(--primary)] hover:text-[var(--sidebar-accent-hover)] p-0 h-auto font-medium text-xs sm:text-sm"
          >
            Marchează toate ca citite
          </Button>
        </CardHeader>

        <CardContent className="p-0 flex flex-col">
          {notificationsList.map((notif) => {
            const Icon = notificationIconMap[notif.type] ?? Bell
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={cn(
                  "flex items-center justify-between px-3 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--border)] last:border-0 transition-colors gap-2 sm:gap-4 cursor-pointer",
                  notif.isUnread ? "bg-[var(--secondary)]/30 hover:bg-[var(--secondary)]/50" : "bg-[var(--card)] hover:bg-[var(--muted)]",
                )}
              >
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center shrink-0">
                    <Icon size={16} className="sm:hidden" strokeWidth={2.5} />
                    <Icon size={18} className="hidden sm:block" strokeWidth={2.5} />
                  </div>

                  <div className="w-2.5 sm:w-4 flex justify-center shrink-0">
                    {notif.isUnread && <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />}
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--foreground)] font-medium leading-snug truncate sm:whitespace-normal">
                    {notif.text}
                  </p>
                </div>

                <span className="text-[11px] sm:text-xs text-[var(--muted-foreground)] font-medium whitespace-nowrap shrink-0 pl-1">
                  {notif.time}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Modal Detaliu Notificare */}
      {selectedNotif && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedNotif(null)}
        >
          <Card
            className="w-full max-w-sm bg-[var(--card)] shadow-xl animate-in zoom-in-95 duration-200 border border-[var(--border)] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border)] pb-3 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Detaliu Notificare</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                onClick={() => setSelectedNotif(null)}
              >
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="pt-5 px-5 pb-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center shrink-0">
                  {(() => {
                    const SelectedIcon = notificationIconMap[selectedNotif.type] ?? Bell
                    return <SelectedIcon size={20} strokeWidth={2.5} />
                  })()}
                </div>
                <span className="text-xs font-medium text-[var(--muted-foreground)]">{selectedNotif.time}</span>
              </div>

              <p className="text-sm text-[var(--foreground)] leading-relaxed break-words">
                {selectedNotif.text}
              </p>

              <Button
                className="mt-2 w-full bg-[var(--primary)] hover:bg-[var(--sidebar-accent-hover)] text-[var(--primary-foreground)]"
                onClick={() => setSelectedNotif(null)}
              >
                Am înțeles
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
