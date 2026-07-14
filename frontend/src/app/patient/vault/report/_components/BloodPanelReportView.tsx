"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PatientSidebar from "@/layouts/PatientSidebar";
import PatientTopNav from "@/layouts/PatientTopNav";
import LabResultsTable, { LabRow } from "@/app/patient/vault/report/_components/LabResultsTable";
import QrCodeModal from "@/app/patient/vault/report/_components/QrCodeModal";
import { VaultReportRecord, getVaultReport } from "@/lib/vault";
import { getVaultCategoryFields } from "@/lib/vaultCategories";

export default function BloodPanelReportView() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const [qrOpen, setQrOpen] = useState(false);
  const [report, setReport] = useState<VaultReportRecord | null>(null);

  useEffect(() => {
    if (reportId) getVaultReport(reportId).then(setReport);
  }, [reportId]);

  if (!report) {
    return (
      <div className="bg-background text-on-surface min-h-screen">
        <PatientSidebar />
        <div className="md:pl-sidebar_width flex flex-col min-h-screen">
          <PatientTopNav />
          <main className="flex-1 flex items-center justify-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              {reportId ? "Loading report..." : "No report selected."}
            </p>
          </main>
        </div>
      </div>
    );
  }

  const rows: LabRow[] = report.results;
  const fields = getVaultCategoryFields(report.category);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <PatientSidebar />
      <div className="md:pl-sidebar_width flex flex-col min-h-screen">
        <PatientTopNav />
        <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-grid_margin">
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-6">
            <Link href="/patient/vault" className="hover:text-primary">
              Vault
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-primary">{report.category}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">{report.title}</span>
          </nav>

          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-stack_gap_lg flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </span>
                <span className="text-on-surface-variant font-mono-label text-mono-label">
                  ID: {report.id.slice(-12).toUpperCase()}
                </span>
              </div>
              <h1 className="font-h1 text-h1 text-on-surface">{report.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-md">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  {report.dateLabel}
                </div>
                <div className="w-1 h-1 bg-outline-variant rounded-full hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">medical_services</span>
                  Ordered by {report.orderedByName}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setQrOpen(true)}
                className="flex items-center gap-2 bg-surface border border-outline-variant text-on-surface font-label-sm text-label-sm px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined">qr_code_2</span>
                View QR Code
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-on-surface text-surface font-label-sm text-label-sm px-6 py-3 rounded-xl hover:bg-primary transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined">download</span>
                Download PDF Report
              </button>
            </div>
          </section>

          <div className="space-y-stack_gap_lg">
            <LabResultsTable
              title={`${fields.rowLabel} Details`}
              subtitle={report.category}
              rows={rows}
              columns={fields.columns}
              showFlag={fields.showFlag}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack_gap_lg">
              <div className="md:col-span-2 bg-white p-6 rounded-xl border border-outline-variant">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center bg-surface-container-high">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      person
                    </span>
                  </div>
                  <div>
                    <h4 className="font-h3 text-h3 text-on-surface">Clinical Remarks</h4>
                    <p className="font-label-sm text-label-sm text-primary">
                      {report.orderedByName} &bull; Lead Clinician
                    </p>
                  </div>
                </div>
                <div className="space-y-4 font-body-md text-on-surface-variant leading-relaxed">
                  <p>
                    Overall, results are within expected ranges. Your clinician will follow up
                    directly if any values require attention or a change to your care plan.
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex flex-col">
                <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold mb-4">
                  Quick Insights
                </h4>
                <div className="space-y-4">
                  {rows.map((row) => {
                    const isNormal = !fields.showFlag || row.flag === "NORMAL" || row.flag === "OPTIMAL";
                    return (
                    <div key={row.testName} className="flex items-start gap-3">
                      <span
                        className={`material-symbols-outlined mt-0.5 ${
                          isNormal ? "text-secondary" : "text-tertiary"
                        }`}
                      >
                        {isNormal ? "check_circle" : "info"}
                      </span>
                      <div>
                        <p className="font-label-sm text-label-sm font-bold text-on-surface">
                          {row.testName}
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                          {row.result} {row.units} &bull; Ref {row.referenceRange}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
                <Link
                  href="/patient/book"
                  className="mt-auto w-full py-2 bg-white border border-primary/30 text-primary font-label-sm text-label-sm rounded-lg hover:bg-primary hover:text-white transition-colors text-center"
                >
                  Schedule Follow-up
                </Link>
              </div>
            </div>
          </div>

          <footer className="mt-12 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high/50 rounded-full border border-outline-variant">
              <span className="material-symbols-outlined text-secondary text-[18px]">lock</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                All clinical data is encrypted with HIPAA-compliant 256-bit AES protection.
              </span>
            </div>
            <div className="flex gap-6 text-[11px] text-outline uppercase tracking-widest font-bold">
              <a className="hover:text-primary" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-primary" href="#">
                Laboratory Standards
              </a>
              <a className="hover:text-primary" href="#">
                Terms of Service
              </a>
            </div>
          </footer>
        </div>
        </main>
      </div>

      <QrCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}
