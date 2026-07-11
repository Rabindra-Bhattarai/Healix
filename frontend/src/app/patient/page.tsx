import VitalSignsOverview from "@/app/patient/_components/VitalSignsOverview";
import HealthPerformanceCard from "@/app/patient/_components/HealthPerformanceCard";
import MedicalVaultCard from "@/app/patient/_components/MedicalVaultCard";
import BodyFocusCard from "@/app/patient/_components/BodyFocusCard";
import ConsultationCard from "@/app/patient/_components/ConsultationCard";
import MessagesFab from "@/app/patient/_components/MessagesFab";

export default function PatientDashboardPage() {
  return (
    <div className="max-w-content mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] leading-tight tracking-tight font-semibold text-on-surface">
          Good morning, <span className="text-primary">Julian</span>
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg mt-2">
          Your holistic health score is up by <span className="text-secondary font-bold">+12%</span> this week.
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