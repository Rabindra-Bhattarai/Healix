import { ReactNode } from "react";
import PatientLayout from "@/layouts/PatientLayout";

export default function PatientRouteLayout({ children }: { children: ReactNode }) {
  return <PatientLayout>{children}</PatientLayout>;
}
