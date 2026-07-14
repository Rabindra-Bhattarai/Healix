"use client";

import { useEffect, useState } from "react";
import PatientSidebar from "@/layouts/PatientSidebar";
import PatientTopNav from "@/layouts/PatientTopNav";
import CategoryFilter from "@/app/patient/vault/_components/CategoryFilter";
import ReportCard from "@/app/patient/vault/_components/ReportCard";
import { VaultReportRecord, getMyVaultReports } from "@/lib/vault";

export default function VaultPage() {
  const [reports, setReports] = useState<VaultReportRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    getMyVaultReports().then(setReports);
  }, []);

  const visibleReports = activeCategory
    ? reports.filter((r) => r.category === activeCategory)
    : reports;

  return (
    <div className="bg-[#F8F9FA] text-[#1A1A1E] min-h-screen">
      <PatientSidebar />
      <div className="md:pl-sidebar_width flex flex-col min-h-screen">
        <PatientTopNav />
        <main className="flex-1 bg-[#F8F9FA] p-4 sm:p-6 lg:p-12 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1E] tracking-tight">
                Medical Vault
              </h2>
              <p className="text-base text-[#6B7280] max-w-2xl leading-relaxed">
                Access your secure clinical repository. Lab results and reports your doctors add
                after a visit appear here automatically, end-to-end encrypted.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-8">
            <CategoryFilter
              reports={reports}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            <div className="col-span-12 lg:col-span-9 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1A1A1E]">Recent Activity</h3>
                <p className="text-xs font-medium text-[#6B7280]/60">
                  Showing {visibleReports.length} of {reports.length} records
                </p>
              </div>

              {visibleReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-3 bg-white rounded-2xl border border-[#E5E7EB]/30">
                  <span className="material-symbols-outlined text-[#6B7280]/30 text-5xl">
                    folder_off
                  </span>
                  <p className="font-bold text-[#1A1A1E]">
                    {reports.length === 0 ? "No documents yet" : "No documents in this category"}
                  </p>
                  <p className="text-sm text-[#6B7280] max-w-sm">
                    {reports.length === 0
                      ? "Lab results and reports your doctors upload will show up here."
                      : "Try a different category from the file explorer."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {visibleReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}

