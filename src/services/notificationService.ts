import { notifications } from "@/data"
import type { Notification } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getNotifications(): Promise<Notification[]> {
  await delay()
  return structuredClone(notifications)
}

export async function markAllNotificationsAsRead(): Promise<Notification[]> {
  await delay()
  notifications.forEach((notification) => {
    notification.isUnread = false
  })
  return structuredClone(notifications)
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification> {
  await delay()
  const notification = notifications.find((n) => n.id === notificationId)
  if (!notification) {
    throw new Error(`Notificarea cu ID-ul ${notificationId} nu a fost găsită.`)
  }
  notification.isUnread = false
  return structuredClone(notification)
}
