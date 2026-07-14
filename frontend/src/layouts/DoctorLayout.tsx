"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/layouts/DoctorSidebar";
import DoctorTopNav from "@/layouts/DoctorTopNav";
import { MobileNavProvider } from "@/layouts/_components/MobileNavContext";
import { getSession } from "@/lib/auth";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role !== "doctor") {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-background">
        <DoctorSidebar />
        <div className="md:pl-sidebar_width flex flex-col min-h-screen">
          <DoctorTopNav />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
