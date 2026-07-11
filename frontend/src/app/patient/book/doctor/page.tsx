import { Suspense } from "react";
import DoctorSelectionView from "@/app/patient/book/doctor/_components/DoctorSelectionView";

export default function DoctorSelectionPage() {
  return (
    <Suspense fallback={null}>
      <DoctorSelectionView />
    </Suspense>
  );
}
