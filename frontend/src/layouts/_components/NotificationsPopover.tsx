"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Portal from "@/components/ui/Portal";
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

export default function NotificationsPopover({
  onClose,
  seeAllHref,
}: {
  onClose: () => void;
  seeAllHref: string;
}) {
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
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end pt-16 px-4 sm:px-0 sm:pr-grid_margin">
        <div className="absolute inset-0 bg-on-background/10 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full sm:w-[400px] max-w-[400px] bg-white rounded-2xl shadow-2xl border border-outline-variant/30 mt-4 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <h4 className="font-h3 text-h3 text-on-surface">Notifications</h4>
            {hasUnread && (
              <button
                onClick={handleMarkAllRead}
                className="font-label-sm text-label-sm text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {notifications === null ? (
              <p className="p-6 text-center font-body-md text-body-md text-on-surface-variant">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center font-body-md text-body-md text-on-surface-variant">
                You&apos;re all caught up.
              </p>
            ) : (
              notifications.map((notification) => {
                const content = (
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[notification.tone]}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
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
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                );

                return (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors ${
                      notification.read ? "" : "bg-primary/5"
                    }`}
                  >
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        onClick={() => {
                          handleItemClick(notification._id);
                          onClose();
                        }}
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
              })
            )}
          </div>

          <div className="px-6 py-4 bg-surface-container-lowest text-center">
            <Link
              href={seeAllHref}
              onClick={onClose}
              className="font-label-sm text-label-sm text-primary font-semibold hover:underline"
            >
              See all notifications
            </Link>
          </div>
        </div>
      </div>
    </Portal>
  );
}
