import PatientSidebar from "@/layouts/PatientSidebar";
import PatientTopNav from "@/layouts/PatientTopNav";
import CategoryFilter from "@/app/patient/vault/_components/CategoryFilter";
import ReportCard, { VaultReport } from "@/app/patient/vault/_components/ReportCard";

const REPORTS: VaultReport[] = [
  {
    icon: "bloodtype",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    status: "Ready",
    statusBg: "bg-emerald-50",
    statusColor: "text-emerald-600",
    title: "Comprehensive Blood Panel",
    orderedBy: "Dr. Elena Rodriguez",
    date: "Oct 24, 2023",
    reportHref: "/patient/vault/report",
  },
  {
    icon: "radiology",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    status: "Pending",
    statusBg: "bg-amber-50",
    statusColor: "text-amber-600",
    title: "MRI Scan - Lumbar Spine",
    orderedBy: "Dr. Marcus Thorne",
    date: "Oct 22, 2023",
  },
];

export default function VaultPage() {
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
                Access your secure clinical repository. Manage all patient documentation, lab
                results, and imaging scans with end-to-end encryption.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#E5E7EB]/50 rounded-xl text-sm font-semibold text-[#6B7280] hover:bg-gray-50 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7F77DD] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-[#7F77DD]/25 transition-all">
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                Upload Report
              </button>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-8">
            <CategoryFilter />

            <div className="col-span-12 lg:col-span-9 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1A1A1E]">Recent Activity</h3>
                <p className="text-xs font-medium text-[#6B7280]/60">Showing 2 of 24 records</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {REPORTS.map((report) => (
                  <ReportCard key={report.title} report={report} />
                ))}
              </div>

              <div className="flex items-center justify-center py-12">
                <nav className="flex items-center gap-3">
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-[#E5E7EB]/30 text-[#6B7280] hover:bg-white transition-all">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#7F77DD] text-white font-bold shadow-lg shadow-[#7F77DD]/20">
                    1
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-[#6B7280] hover:bg-white transition-all font-medium">
                    2
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-[#6B7280] hover:bg-white transition-all font-medium">
                    3
                  </button>
                  <span className="px-2 text-[#6B7280]/30">•••</span>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-[#6B7280] hover:bg-white transition-all font-medium">
                    8
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-[#E5E7EB]/30 text-[#6B7280] hover:bg-white transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}

