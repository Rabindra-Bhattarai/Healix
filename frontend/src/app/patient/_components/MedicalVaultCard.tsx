"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VaultReportRecord, getMyVaultReports } from "@/lib/vault";

const CATEGORY_ICON: Record<string, string> = {
  "Lab Results": "bloodtype",
  Imaging: "radiology",
  Prescriptions: "prescriptions",
};

export default function MedicalVaultCard() {
  const [reports, setReports] = useState<VaultReportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyVaultReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const recent = reports.slice(0, 2);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[280px] shadow-lg">
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-2">
        <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
          Medical Vault
        </h3>
        <Link
          href="/patient/vault"
          className="text-primary font-bold flex items-center gap-1 sm:gap-2 group px-3 sm:px-6 py-3 sm:-mr-6 hover:bg-primary/5 rounded-full transition-all shrink-0"
        >
          <span className="text-base sm:text-lg">View All</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            chevron_right
          </span>
        </Link>
      </div>

      {!loading && recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8 gap-3">
          <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">folder_off</span>
          <p className="font-bold text-on-surface">No documents yet</p>
          <p className="text-on-surface-variant text-sm max-w-sm">
            Lab results and reports your doctors upload will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recent.map((report) => (
            <Link
              key={report.id}
              href={report.status === "Ready" ? `/patient/vault/report?id=${report.id}` : "/patient/vault"}
              className="bg-white border border-outline-variant p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-surface-container-low transition-all group"
            >
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-primary-fixed/40 flex items-center justify-center text-primary transition-transform group-hover:scale-105 shrink-0">
                  <span className="material-symbols-outlined text-3xl">
                    {CATEGORY_ICON[report.category] ?? "description"}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-on-surface text-lg truncate">{report.title}</h4>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mt-0.5 truncate">
                    {report.category} · {report.dateLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-8 pl-[72px] sm:pl-0">
                <span
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${
                    report.status === "Ready"
                      ? "text-secondary bg-secondary-container/50"
                      : "text-tertiary bg-tertiary-fixed/50"
                  }`}
                >
                  {report.status === "Ready" ? "COMPLETED" : "PENDING"}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant p-3 group-hover:bg-surface-container-highest rounded-full transition-colors ml-auto sm:ml-0">
                  {report.status === "Ready" ? "download" : "visibility"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
