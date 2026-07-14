import { ReactNode } from "react";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
