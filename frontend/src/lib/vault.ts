import { api } from "@/lib/api";

export type LabFlag = "NORMAL" | "HIGH" | "LOW" | "OPTIMAL";

export interface LabResultRow {
  testName: string;
  result: string;
  flag: LabFlag;
  referenceRange: string;
  units: string;
}

export interface VaultReportRecord {
  id: string;
  title: string;
  category: string;
  orderedByName: string;
  dateLabel: string;
  status: "Ready" | "Pending";
  fileSize: string;
  results: LabResultRow[];
}

interface RawVaultReport {
  _id: string;
  title: string;
  category: string;
  orderedByName: string;
  dateLabel: string;
  status: "Ready" | "Pending";
  fileSize: string;
  results: LabResultRow[];
}

function toRecord(raw: RawVaultReport): VaultReportRecord {
  return {
    id: raw._id,
    title: raw.title,
    category: raw.category,
    orderedByName: raw.orderedByName,
    dateLabel: raw.dateLabel,
    status: raw.status,
    fileSize: raw.fileSize,
    results: raw.results,
  };
}

export async function getMyVaultReports(): Promise<VaultReportRecord[]> {
  const { reports } = await api.get<{ reports: RawVaultReport[] }>("/vault/me");
  return reports.map(toRecord);
}

export async function getVaultReport(id: string): Promise<VaultReportRecord> {
  const { report } = await api.get<{ report: RawVaultReport }>(`/vault/${id}`);
  return toRecord(report);
}

export interface CreateVaultReportInput {
  patientId: string;
  title: string;
  category: string;
  status: "Ready" | "Pending";
  results?: LabResultRow[];
}

export async function createVaultReport(input: CreateVaultReportInput): Promise<VaultReportRecord> {
  const { report } = await api.post<{ report: RawVaultReport }>("/vault", input);
  return toRecord(report);
}
