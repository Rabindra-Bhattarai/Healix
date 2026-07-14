"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import NotificationsPopover from "@/layouts/_components/NotificationsPopover";
import { useMobileNav } from "@/layouts/_components/MobileNavContext";
import { getSession } from "@/lib/auth";
import { getUnreadCount } from "@/lib/notifications";

const TITLES: Record<string, string> = {
  "/patient": "Dashboard",
  "/patient/book": "Department Selection",
  "/patient/book/doctor": "Book Appointment",
  "/patient/queue": "My Queue",
  "/patient/vault": "Health Vault",
  "/patient/vault/report": "Blood Panel Report",
  "/patient/messages": "Messages",
  "/patient/notifications": "Notifications",
  "/patient/profile": "Profile",
  "/patient/appointments": "Appointments",
};

export default function PatientTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(0);
  const { setOpen: setMobileNavOpen } = useMobileNav();

  // Re-read on every route change so a photo uploaded on /patient/profile
  // shows up here as soon as the user navigates elsewhere.
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

  let header: React.ReactNode;

  if (pathname === "/patient/book/triage") {
    header = (
      <header className="sticky top-0 z-30 h-16 bg-background border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          {menuButton}
          <button
            onClick={() => router.push("/patient/book")}
            className="flex items-center gap-1 py-1 px-2 -ml-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant group shrink-0"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary">
              arrow_back
            </span>
            <span className="font-body-md font-medium group-hover:text-primary hidden sm:inline">
              Back
            </span>
          </button>
          <span className="material-symbols-outlined text-primary hidden sm:inline">
            medical_services
          </span>
          <h2 className="font-h3 text-h3 text-primary truncate">AI Symptom Triage</h2>
        </div>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notificationBadge}
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors hidden sm:inline-flex">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>
    );
  } else if (pathname === "/patient/book/time") {
    header = (
      <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-1 min-w-0">
          {menuButton}
          <div className="flex items-center gap-1 font-label-sm text-label-sm font-medium text-on-surface-variant min-w-0">
            <span className="material-symbols-outlined text-[18px] shrink-0">location_on</span>
            <span className="truncate">Tribhuvan University Teaching Hospital</span>
            <span className="material-symbols-outlined text-[16px] ml-1 hidden sm:inline">
              expand_more
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notificationBadge}
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors hidden sm:inline-flex">
            <span className="material-symbols-outlined">help</span>
          </button>
          <Link
            href="/patient/profile"
            aria-label="Profile"
            className="size-8 rounded-full border border-outline-variant/30 bg-surface-container-high flex items-center justify-center overflow-hidden hover:border-primary transition-colors shrink-0"
          >
            {avatarContent}
          </Link>
        </div>
      </header>
    );
  } else {
    const title = (pathname && TITLES[pathname]) ?? "Dashboard";
    header = (
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
            href="/patient/profile"
            aria-label="Profile"
            className="size-8 rounded-full border border-outline-variant/30 bg-surface-container-high flex items-center justify-center overflow-hidden hover:border-primary transition-colors shrink-0"
          >
            {avatarContent}
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      {header}
      {notifOpen && (
        <NotificationsPopover onClose={handleCloseNotif} seeAllHref="/patient/notifications" />
      )}
    </>
  );
}