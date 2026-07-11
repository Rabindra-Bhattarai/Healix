"use client";

import { useState } from "react";

const RANGES = ["Weekly", "Monthly", "Yearly"] as const;

const METRICS = [
  { label: "Immune Response", percent: 85, color: "bg-secondary", glow: "shadow-[0_0_8px_rgba(0,108,78,0.4)]" },
  { label: "Sleep Efficiency", percent: 72, color: "bg-primary", glow: "shadow-[0_0_8px_rgba(87,78,177,0.4)]" },
  { label: "Cortisol Level", percent: 40, color: "bg-error", glow: "" },
];

export default function HealthPerformanceCard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("Weekly");

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[480px] lg:h-[540px] shadow-lg relative overflow-hidden">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-10 relative z-10">
        <div>
          <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
            Health Performance Index
          </h3>
          <p className="text-on-surface-variant text-base mt-1">Holistic progression vs previous month</p>
        </div>
        <div className="flex gap-2 bg-surface-container p-1.5 rounded-2xl self-start">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 sm:px-5 py-2 rounded-xl text-sm transition-all ${
                range === r
                  ? "bg-surface-container-highest text-on-surface font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 relative mt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
          <defs>
            <linearGradient id="healthChartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#574eb1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#574eb1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,150 Q100,50 200,100 T400,60 T600,120 T800,20 V200 H0 Z" fill="url(#healthChartGradient)" />
          <path
            d="M0,150 Q100,50 200,100 T400,60 T600,120 T800,20"
            fill="none"
            stroke="#574eb1"
            strokeLinecap="round"
            strokeWidth="4.5"
            style={{ filter: "drop-shadow(0 0 4px rgba(87,78,177,0.4))" }}
          />
          <circle cx="200" cy="100" fill="#ffffff" r="7" stroke="#574eb1" strokeWidth="3" />
          <circle cx="400" cy="60" fill="#ffffff" r="7" stroke="#574eb1" strokeWidth="3" />
          <circle cx="800" cy="20" fill="#ffffff" r="7" stroke="#574eb1" strokeWidth="3" />
        </svg>
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 bg-white border border-primary/20 px-6 py-3 rounded-2xl shadow-lg pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Peak Performance
          </p>
          <p className="text-primary font-bold text-2xl">94.2 Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mt-8 sm:mt-12">
        {METRICS.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <p className="text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">
              {metric.label}
            </p>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${metric.color} ${metric.glow}`}
                style={{ width: `${metric.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}