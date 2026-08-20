import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/common"
import { cn } from "@/utils"
import {
  Star,
  Monitor,
  Bell,
  CheckCircle2,
  Users,
  CloudRain,
  Repeat,
  type LucideIcon,
} from "lucide-react"
import { answerInvitation, getMyInvitations, getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/services"
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
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const [pendingInvitationId, setPendingInvitationId] = useState<number | null>(null)

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications()
        setNotificationsList(data)
      } catch (error) {
        console.error("Eroare la încărcarea notificărilor:", error)
      } finally {
        setIsLoading(false)
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
    setPendingInvitationId(null)
    if (notif.isUnread) {
      try {
        const updated = await markNotificationAsRead(notif.id)
        setNotificationsList((current) =>
          current.map((n) => (n.id === updated.id ? { ...n, isUnread: false } : n)),
        )
      } catch (error) {
        console.error("Eroare la marcarea notificării:", error)
      }
    }
    if (notif.officeInvitationId) {
      try {
        const invitations = await getMyInvitations("received")
        const invitation = invitations.find((item) => item.id === notif.officeInvitationId)
        if (invitation?.status === "IN_ASTEPTARE") setPendingInvitationId(invitation.id)
      } catch (error) { console.error("Eroare la încărcarea invitației:", error) }
    }
  }

  async function respondToInvitation(status: "ACCEPTATA" | "REFUZATA") {
    if (!pendingInvitationId) return
    try {
      await answerInvitation(pendingInvitationId, status)
      setPendingInvitationId(null)
      setSelectedNotif(null)
    } catch (error) { console.error("Eroare la răspunsul invitației:", error) }
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
          {isLoading ? (
            <div className="flex flex-col animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--muted)] shrink-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--muted)] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-[var(--muted)]" />
                    <div className="h-3 w-1/2 rounded bg-[var(--muted)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            notificationsList.map((notif) => {
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
          })
          )}
        </CardContent>
      </Card>

      {/* Modal Detaliu Notificare */}
      {selectedNotif && (
        <Modal onClose={() => setSelectedNotif(null)} maxWidth="sm">
          <ModalHeader
            title="Detaliu Notificare"
            onClose={() => setSelectedNotif(null)}
          />
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            {pendingInvitationId && <><Button className="flex-1" onClick={() => respondToInvitation("ACCEPTATA")}>Acceptă</Button><Button variant="outline" className="flex-1" onClick={() => respondToInvitation("REFUZATA")}>Refuză</Button></>}
            <Button
              className="w-full bg-[var(--primary)] hover:bg-[var(--sidebar-accent-hover)] text-[var(--primary-foreground)]"
              onClick={() => setSelectedNotif(null)}
            >
              Am înțeles
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  )
}
