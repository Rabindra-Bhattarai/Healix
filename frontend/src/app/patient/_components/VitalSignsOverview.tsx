"use client";

import { useEffect, useState } from "react";
import { VaultReportRecord, getMyVaultReports } from "@/lib/vault";
import { VITAL_METRICS, VitalTone } from "@/lib/vaultCategories";
import { getTrendDelta, getVitalHistory } from "@/lib/vitalsHistory";

const TONE_CLASSES: Record<VitalTone, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
  error: "bg-error/10 text-error",
};

const FLAG_TAG_CLASSES: Record<string, string> = {
  NORMAL: "bg-secondary/10 text-secondary",
  OPTIMAL: "bg-tertiary/10 text-tertiary",
  HIGH: "bg-error/10 text-error",
  LOW: "bg-error/10 text-error",
};

const DASHBOARD_METRICS = ["Heart Rate", "Blood Pressure", "SpO2"];

function Sparkline({ values, tone }: { values: number[]; tone: VitalTone }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);
  const w = 64;
  const h = 20;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const strokeColor =
    tone === "error" ? "#b3261e" : tone === "secondary" ? "#006c4e" : tone === "tertiary" ? "#745800" : "#574eb1";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VitalSignsOverview() {
  const [reports, setReports] = useState<VaultReportRecord[] | null>(null);

  useEffect(() => {
    getMyVaultReports().then(setReports);
  }, []);

  const latestVitals = reports?.find((r) => r.category === "Vitals");

  return (
    <section className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
          <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
            Vital Signs Overview
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
          {latestVitals ? latestVitals.dateLabel : "No data yet"}
        </span>
      </div>

      {reports === null ? null : !latestVitals ? (
        <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
          <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">
            monitor_heart
          </span>
          <p className="font-bold text-on-surface">No vitals recorded yet</p>
          <p className="text-on-surface-variant text-sm max-w-sm">
            Your heart rate, blood pressure, and SpO2 readings will appear here after your first
            check-up.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {latestVitals.results
            .filter((row) => DASHBOARD_METRICS.includes(row.testName))
            .map((row) => {
            const metric = VITAL_METRICS.find((m) => m.name === row.testName);
            const tone = metric?.tone ?? "primary";
            const history = getVitalHistory(reports, row.testName);
            const delta = getTrendDelta(history);

            return (
              <div
                key={row.testName}
                className="bg-white border border-outline-variant/20 rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TONE_CLASSES[tone]}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {metric?.icon ?? "monitor_heart"}
                    </span>
                  </span>
                  {row.flag && (
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${FLAG_TAG_CLASSES[row.flag] ?? "bg-surface-container text-on-surface-variant"}`}
                    >
                      {row.flag}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                    {row.testName}
                  </p>
                  <p className="text-2xl font-semibold text-on-surface">
                    {row.result}
                    <span className="text-sm font-normal text-on-surface-variant ml-1">
                      {row.units}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  {delta ? (
                    <span
                      className={`flex items-center gap-0.5 font-label-sm text-label-sm ${
                        delta.diff === 0 ? "text-on-surface-variant" : "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {delta.diff > 0 ? "trending_up" : delta.diff < 0 ? "trending_down" : "trending_flat"}
                      </span>
                      {delta.diff > 0 ? "+" : ""}
                      {Math.abs(delta.pct) < 0.1 ? delta.diff.toFixed(1) : `${delta.pct.toFixed(1)}%`} since last
                    </span>
                  ) : (
                    <span />
                  )}
                  <Sparkline values={history.map((h) => h.value)} tone={tone} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
