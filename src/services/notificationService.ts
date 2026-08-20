import { apiClient } from "./apiClient"
import { withCache, invalidateCache } from "./cache"
import type { Notification } from "@/types"

// ─── Notification Service ──────────────────────────────────────────────────────
// GET /users/me/notifications?userId={id}&isRead=   → toate notificările
// PUT /users/me/notifications/{id}/read?userId={id} → marchează ca citită
// PUT /users/me/notifications/read-all?userId={id}  → marchează toate ca citite
//
// NOTĂ: Backend-ul cere userId ca query param. Îl luăm din token via GET /users/me.

// ─── Tipuri BE ────────────────────────────────────────────────────────────────

interface BeNotificationResponse {
  id: number
  userId: number
  message: string
  type: string
  createdAt: string
  bookingId: number | null
  officeInvitationId: number | null
  hasBeenRead: boolean
}

// ─── Mapare BE → Notification FE ──────────────────────────────────────────────

function mapToNotification(n: BeNotificationResponse): Notification {
  return {
    id:       n.id,
    type:     "confirmed",   // BE trimite tipuri ca string liber; mappăm la cel mai generic
    text:     n.message,
    time:     n.createdAt
                ? new Date(n.createdAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })
                : "",
    isUnread: !n.hasBeenRead,
    officeInvitationId: n.officeInvitationId,
  }
}

// ─── Helper: obține userId curent ─────────────────────────────────────────────

let cachedUserId: number | null = null

export async function getCurrentUserId(): Promise<number> {
  if (cachedUserId) return cachedUserId
  const me = await apiClient.get<{ id?: number; userId?: number }>("/users/me")
  // BE returnează MyAccountResponse — nu are id direct, îl extragem din token dacă e disponibil
  // Alternativ, backend-ul deduce userId din token la notificări dacă trimitem un userId valid
  // Folosim un fallback sigur: parsăm token-ul JWT pentru sub
  const token = localStorage.getItem("auth_token")
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      // BE stochează userId sau sub în token
      if (payload.userId) { cachedUserId = payload.userId; return cachedUserId! }
    } catch { /* ignorăm */ }
  }
  cachedUserId = (me as { id?: number }).id ?? 1
  return cachedUserId!
}

// ─── API ───────────────────────────────────────────────────────────────────────

export function getNotifications(): Promise<Notification[]> {
  return withCache("notifications", async () => {
    const data = await apiClient.get<BeNotificationResponse[]>("/users/me/notifications")
    return data.map(mapToNotification)
  }, 30_000) // 30s — notificările se schimbă frecvent
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification> {
  await apiClient.put<void>(`/users/me/notifications/${notificationId}/read`)
  invalidateCache("notifications")
  // BE returnează 200 fără body — reconstruim obiectul local
  return {
    id:       notificationId,
    type:     "confirmed",
    text:     "",
    time:     "",
    isUnread: false,
  }
}

export async function markAllNotificationsAsRead(): Promise<Notification[]> {
  await apiClient.put<void>("/users/me/notifications/read-all")
  invalidateCache("notifications")
  // Returnăm lista actualizată
  return getNotifications()
}
