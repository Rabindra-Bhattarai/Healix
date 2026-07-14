"use client";

import { useEffect, useState } from "react";
import { getMyVaultReports } from "@/lib/vault";
import { getVitalHistory, getTrendDelta, VitalPoint } from "@/lib/vitalsHistory";

const TRACKED_METRIC = "Heart Rate";

function buildSmoothPath(values: number[], width: number, height: number, padding: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);
  const usableH = height - padding * 2;
  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: padding + usableH - ((v - min) / range) * usableH,
  }));

  if (points.length < 2) return { linePath: "", areaPath: "" };

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    linePath += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  return { linePath, areaPath };
}

export default function HealthPerformanceCard() {
  const [history, setHistory] = useState<VitalPoint[] | null>(null);

  useEffect(() => {
    getMyVaultReports().then((reports) => {
      setHistory(getVitalHistory(reports, TRACKED_METRIC));
    });
  }, []);

  const hasTrend = history && history.length >= 2;
  const width = 560;
  const height = 160;
  const padding = 16;
  const { linePath, areaPath } = hasTrend
    ? buildSmoothPath(history.map((p) => p.value), width, height, padding)
    : { linePath: "", areaPath: "" };

  const delta = hasTrend ? getTrendDelta(history) : null;
  const current = hasTrend ? history[history.length - 1] : null;
  const min = hasTrend ? Math.min(...history.map((p) => p.value)) : null;
  const max = hasTrend ? Math.max(...history.map((p) => p.value)) : null;

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[320px] shadow-lg relative overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
            Health Performance Index
          </h3>
          <p className="text-on-surface-variant text-base mt-1">
            {TRACKED_METRIC} trend across your recorded vitals
          </p>
        </div>
        {current && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-semibold text-on-surface">
              {current.value}
              <span className="text-sm font-normal text-on-surface-variant ml-1">{current.units}</span>
            </p>
            {delta && (
              <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-0.5">
                <span className="material-symbols-outlined text-[14px]">
                  {delta.diff > 0 ? "trending_up" : delta.diff < 0 ? "trending_down" : "trending_flat"}
                </span>
                {delta.diff > 0 ? "+" : ""}
                {delta.diff.toFixed(1)} since last reading
              </p>
            )}
          </div>
        )}
      </div>

      {history === null ? null : !hasTrend ? (
        <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
          <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">
            monitoring
          </span>
          <p className="font-bold text-on-surface">Not enough data yet</p>
          <p className="text-on-surface-variant text-sm max-w-sm">
            Your performance index builds up as your doctors record vitals across visits.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#574eb1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#574eb1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#perfGradient)" />
            <path d={linePath} fill="none" stroke="#574eb1" strokeWidth={3} strokeLinecap="round" />
          </svg>
          <div className="flex items-center justify-between mt-3 font-label-sm text-label-sm text-on-surface-variant">
            <span>Low: {min}</span>
            <span>{history.length} readings recorded</span>
            <span>High: {max}</span>
          </div>
        </div>
      )}
    </div>
  );
}
