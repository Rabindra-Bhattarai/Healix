"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NotificationsPopover from "@/layouts/_components/NotificationsPopover";
import { useMobileNav } from "@/layouts/_components/MobileNavContext";
import { getSession } from "@/lib/auth";
import { getUnreadCount } from "@/lib/notifications";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/doctors": "Doctors Management",
  "/admin/departments": "Departments Management",
  "/admin/appointments": "Appointments",
  "/admin/reports": "Doctor Reports",
  "/admin/notifications": "Notifications",
  "/admin/profile": "Profile",
};

export default function AdminTopNav() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(0);
  const { setOpen: setMobileNavOpen } = useMobileNav();

  useEffect(() => {
    setAvatarUrl(getSession()?.user.avatarUrl);
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {});
  }, [pathname]);

  function handleCloseNotif() {
    setNotifOpen(false);
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {});
  }

  const notificationBadge = unreadCount > 0 && (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-error text-white text-[10px] leading-4 text-center font-semibold">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );

  const avatarContent = avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
  );

  const menuButton = (
    <button
      onClick={() => setMobileNavOpen(true)}
      aria-label="Open menu"
      className="md:hidden text-on-surface-variant hover:text-primary p-1 -ml-1 mr-1"
    >
      <span className="material-symbols-outlined">menu</span>
    </button>
  );

  const title = (pathname && TITLES[pathname]) ?? "Dashboard";

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-background border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-1 min-w-0">
          {menuButton}
          <h2 className="font-h3 text-h3 text-primary truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {notificationBadge}
          </button>
          <Link
            href="/admin/profile"
            aria-label="Profile"
            className="size-8 rounded-full border border-outline-variant/30 bg-surface-container-high flex items-center justify-center overflow-hidden hover:border-primary transition-colors shrink-0"
          >
            {avatarContent}
          </Link>
        </div>
      </header>
      {notifOpen && (
        <NotificationsPopover onClose={handleCloseNotif} seeAllHref="/admin/notifications" />
      )}
    </>
  );
}
