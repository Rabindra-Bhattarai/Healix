import { ReactNode } from "react";
import DoctorLayout from "@/layouts/DoctorLayout";

export default function DoctorRouteLayout({ children }: { children: ReactNode }) {
  return <DoctorLayout>{children}</DoctorLayout>;
}
