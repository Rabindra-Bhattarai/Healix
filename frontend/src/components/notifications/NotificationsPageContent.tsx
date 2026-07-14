"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  NotificationItem,
  formatRelativeTime,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notifications";

const TONE_CLASSES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
  error: "bg-error/10 text-error",
};

export default function NotificationsPageContent() {
  const [notifications, setNotifications] = useState<NotificationItem[] | null>(null);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev);
  }

  async function handleItemClick(id: string) {
    setNotifications((prev) => prev?.map((n) => (n._id === id ? { ...n, read: true } : n)) ?? prev);
    try {
      await markNotificationAsRead(id);
    } catch {
      // best-effort; UI already reflects read state
    }
  }

  const hasUnread = notifications?.some((n) => !n.read) ?? false;

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-2">Notifications</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Updates about your appointments, messages, and health records.
          </p>
        </div>
        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm self-start"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        {notifications === null ? (
          <p className="p-8 text-center font-body-md text-body-md text-on-surface-variant">
            Loading...
          </p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary text-5xl">
                notifications_none
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-3">You&apos;re all caught up</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Updates about your appointments, messages, and health records will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {notifications.map((notification) => {
              const content = (
                <div className="flex gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[notification.tone]}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {notification.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md text-on-surface">
                      {notification.text}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
              );

              return (
                <div
                  key={notification._id}
                  className={`px-5 sm:px-8 py-5 hover:bg-surface-container-low/30 transition-colors ${
                    notification.read ? "" : "bg-primary/5"
                  }`}
                >
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      onClick={() => handleItemClick(notification._id)}
                      className="block"
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleItemClick(notification._id)}
                      className="block w-full text-left"
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
