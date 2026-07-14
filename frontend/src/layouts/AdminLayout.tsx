"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/layouts/AdminSidebar";
import AdminTopNav from "@/layouts/AdminTopNav";
import { MobileNavProvider } from "@/layouts/_components/MobileNavContext";
import { getSession } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role !== "admin") {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="md:pl-sidebar_width flex flex-col min-h-screen">
          <AdminTopNav />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
