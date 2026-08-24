import { apiClient } from "./apiClient"

export type InvitationDirection = "all" | "sent" | "received"
export type InvitationStatus = "IN_ASTEPTARE" | "ACCEPTATA" | "REFUZATA"

export interface OfficeInvitation {
  id: number
  senderId: number
  senderName?: string
  receiverId: number
  receiverName?: string
  message: string
  proposedDate: string
  createdAt: string
  answeredAt: string | null
  status: InvitationStatus
}

export function getMyInvitations(direction: InvitationDirection = "all") {
  return apiClient.get<OfficeInvitation[]>(`/users/me/invitations?direction=${direction}`)
}

export function answerInvitation(id: number, invitationStatus: Extract<InvitationStatus, "ACCEPTATA" | "REFUZATA">) {
  return apiClient.patch<OfficeInvitation>(`/users/me/invitations/${id}/response`, { invitationStatus })
}

export function createOfficeInvitation(colleagueId: number, message: string, proposedDate: string) {
  return apiClient.post<OfficeInvitation>(`/users/${colleagueId}/office-invitation`, { message, proposedDate })
}
