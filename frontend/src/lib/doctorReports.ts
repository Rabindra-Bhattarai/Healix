import { api } from "@/lib/api";

export type DoctorReportCategory =
  | "Unprofessional Behavior"
  | "Rude or Disrespectful"
  | "Misdiagnosis or Poor Care"
  | "Inappropriate Conduct"
  | "Other";

export type DoctorReportStatus = "Open" | "Reviewed" | "Dismissed";

export const DOCTOR_REPORT_CATEGORIES: DoctorReportCategory[] = [
  "Unprofessional Behavior",
  "Rude or Disrespectful",
  "Misdiagnosis or Poor Care",
  "Inappropriate Conduct",
  "Other",
];

export interface DoctorReportRecord {
  _id: string;
  doctor: string;
  doctorName: string;
  category: DoctorReportCategory;
  description: string;
  photoUrl?: string;
  status: DoctorReportStatus;
  createdAt: string;
  patient: { _id: string; name: string; email: string };
}

export async function reportDoctor(input: {
  doctorId: string;
  category: DoctorReportCategory;
  description: string;
  photoUrl?: string;
}): Promise<void> {
  await api.post("/doctor-reports", input);
}

export async function getAllDoctorReports(): Promise<DoctorReportRecord[]> {
  const { reports } = await api.get<{ reports: DoctorReportRecord[] }>("/doctor-reports");
  return reports;
}

export async function updateDoctorReportStatus(
  id: string,
  status: DoctorReportStatus
): Promise<DoctorReportRecord> {
  const { report } = await api.patch<{ report: DoctorReportRecord }>(
    `/doctor-reports/${id}/status`,
    { status }
  );
  return report;
}
