"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PatientSidebar from "@/layouts/PatientSidebar";
import PatientTopNav from "@/layouts/PatientTopNav";
import { MobileNavProvider } from "@/layouts/_components/MobileNavContext";
import { getSession } from "@/lib/auth";

const FULL_BLEED_ROUTES = new Set([
  "/patient/book/details",
  "/patient/vault",
  "/patient/vault/report",
]);

export default function PatientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role !== "patient") {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  if (pathname && FULL_BLEED_ROUTES.has(pathname)) {
    return (
      <MobileNavProvider>
        <div className="min-h-screen bg-background">{children}</div>
      </MobileNavProvider>
    );
  }

  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-background">
        <PatientSidebar />
        <div className="md:pl-sidebar_width flex flex-col min-h-screen">
          <PatientTopNav />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
