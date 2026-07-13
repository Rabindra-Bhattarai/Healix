"use client";

import { useEffect, useState } from "react";
import VitalSignsOverview from "@/app/patient/_components/VitalSignsOverview";
import HealthPerformanceCard from "@/app/patient/_components/HealthPerformanceCard";
import MedicalVaultCard from "@/app/patient/_components/MedicalVaultCard";
import BodyFocusCard from "@/app/patient/_components/BodyFocusCard";
import ConsultationCard from "@/app/patient/_components/ConsultationCard";
import MessagesFab from "@/app/patient/_components/MessagesFab";
import { getSession } from "@/lib/auth";

export default function PatientDashboardPage() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session) setFirstName(session.user.name.split(" ")[0]);
  }, []);

  return (
    <div className="max-w-content mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] leading-tight tracking-tight font-semibold text-on-surface">
          Good morning{firstName ? "," : ""} <span className="text-primary">{firstName}</span>
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg mt-2">
          Here&apos;s an overview of your health and care.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
          <VitalSignsOverview />
        </div>

        <div className="col-span-12 xl:col-span-8 space-y-8">
          <HealthPerformanceCard />
          <MedicalVaultCard />
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-8">
          <BodyFocusCard />
          <ConsultationCard />
        </div>
      </div>

      <MessagesFab />
    </div>
  );
}
