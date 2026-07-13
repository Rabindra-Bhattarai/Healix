import { Suspense } from "react";
import BloodPanelReportView from "@/app/patient/vault/report/_components/BloodPanelReportView";

export default function BloodPanelReportPage() {
  return (
    <Suspense fallback={null}>
      <BloodPanelReportView />
    </Suspense>
  );
}
