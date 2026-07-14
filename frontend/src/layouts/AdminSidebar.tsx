"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutConfirmModal from "@/layouts/_components/LogoutConfirmModal";
import { useMobileNav } from "@/layouts/_components/MobileNavContext";
import { clearSession } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/doctors", label: "Doctors", icon: "stethoscope" },
  { href: "/admin/departments", label: "Departments", icon: "domain" },
  { href: "/admin/appointments", label: "Appointments", icon: "event_note" },
  { href: "/admin/reports", label: "Reports", icon: "flag" },
  { href: "/admin/profile", label: "Profile", icon: "account_circle" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { open, setOpen } = useMobileNav();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-on-background/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-sidebar_width bg-background border-r border-outline-variant/20 flex flex-col py-6 z-50 transform transition-transform duration-200 ease-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pb-10 flex items-start justify-between">
          <div>
            <p className="font-bold text-2xl tracking-[-0.24px] text-primary leading-8">Healix</p>
            <p className="font-body-md text-body-md text-on-surface-variant/70">Admin Console</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="md:hidden text-on-surface-variant hover:text-primary p-1 -mr-2"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 pl-6 pr-[26px] py-3 border-r-2 transition-colors ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pt-4">
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 w-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-body-md text-body-md">Logout</span>
          </button>
        </div>

        {logoutOpen && (
          <LogoutConfirmModal
            onCancel={() => setLogoutOpen(false)}
            onConfirm={() => {
              clearSession();
              router.push("/login");
            }}
          />
        )}
      </aside>
    </>
  );
}
