import { VaultReportRecord } from "@/lib/vault";

export interface VitalPoint {
  dateLabel: string;
  value: number;
  units: string;
  flag: string;
}

export function getVitalHistory(reports: VaultReportRecord[], metricName: string): VitalPoint[] {
  const vitals = reports.filter((r) => r.category === "Vitals").slice().reverse();
  const points: VitalPoint[] = [];
  for (const report of vitals) {
    const row = report.results.find((r) => r.testName === metricName);
    if (!row) continue;
    const value = parseFloat(row.result);
    if (Number.isNaN(value)) continue;
    points.push({ dateLabel: report.dateLabel, value, units: row.units, flag: row.flag });
  }
  return points;
}

export function getTrendDelta(history: VitalPoint[]): { diff: number; pct: number } | null {
  if (history.length < 2) return null;
  const current = history[history.length - 1].value;
  const previous = history[history.length - 2].value;
  if (previous === 0) return null;
  return { diff: current - previous, pct: ((current - previous) / previous) * 100 };
}
