import { api } from "@/lib/api";

export type NotificationTone = "primary" | "secondary" | "tertiary" | "error";

export interface NotificationItem {
  _id: string;
  type: string;
  icon: string;
  tone: NotificationTone;
  text: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const { notifications } = await api.get<{ notifications: NotificationItem[] }>("/notifications");
  return notifications;
}

export async function getUnreadCount(): Promise<number> {
  const { count } = await api.get<{ count: number }>("/notifications/unread-count");
  return count;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
