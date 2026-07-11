"use client";

import Link from "next/link";
import Portal from "@/components/ui/Portal";

const NOTIFICATIONS = [
  {
    icon: "calendar_clock",
    tone: "primary",
    text: "Appointment Reminder: Your session with Dr. Michael Chen is in 2 hours.",
    action: { label: "View", href: "/patient/appointments" },
  },
  {
    icon: "description",
    tone: "secondary",
    text: "Medical Vault Update: New Blood Panel report uploaded.",
    downloadHref: "/patient/vault/report",
  },
  {
    icon: "chat",
    tone: "tertiary",
    text: "New Message: Dr. Sarah Jenkins sent you a message.",
    action: { label: "Reply", href: "/patient/messages" },
  },
];

const TONE_CLASSES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
};

export default function NotificationsPopover({ onClose }: { onClose: () => void }) {
  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end pt-16 px-4 sm:px-0 sm:pr-grid_margin">
      <div className="absolute inset-0 bg-on-background/10 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full sm:w-[400px] max-w-[400px] bg-white rounded-2xl shadow-2xl border border-outline-variant/30 mt-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <h4 className="font-h3 text-h3 text-on-surface">Notifications</h4>
          <button className="font-label-sm text-label-sm text-primary hover:underline">
            Mark all as read
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {NOTIFICATIONS.map((notification) => (
            <div
              key={notification.text}
              className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors"
            >
              <div className="flex gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[notification.tone]}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {notification.icon}
                  </span>
                </div>
                {notification.downloadHref ? (
                  <div className="flex-1 flex items-center justify-between">
                    <p className="font-body-md text-body-md text-on-surface pr-4">
                      {notification.text}
                    </p>
                    <Link
                      href={notification.downloadHref}
                      onClick={onClose}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">download</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="font-body-md text-body-md text-on-surface">
                      {notification.text}
                    </p>
                    {notification.action && (
                      <Link
                        href={notification.action.href}
                        onClick={onClose}
                        className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-lg font-label-sm text-label-sm hover:bg-primary hover:text-on-primary transition-all"
                      >
                        {notification.action.label}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-surface-container-lowest text-center">
          <a href="#" className="font-label-sm text-label-sm text-primary font-semibold hover:underline">
            See all notifications
          </a>
        </div>
      </div>
    </div>
    </Portal>
  );
}