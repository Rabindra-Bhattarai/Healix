import Link from "next/link";
import { VaultReportRecord } from "@/lib/vault";

const CATEGORY_ICON: Record<string, string> = {
  "Lab Results": "bloodtype",
  Imaging: "radiology",
  Prescriptions: "prescriptions",
};

export default function ReportCard({ report }: { report: VaultReportRecord }) {
  const isReady = report.status === "Ready";
  const icon = CATEGORY_ICON[report.category] ?? "description";
  const iconBg = isReady ? "bg-emerald-50" : "bg-amber-50";
  const iconColor = isReady ? "text-emerald-500" : "text-amber-500";
  const statusBg = isReady ? "bg-emerald-50" : "bg-amber-50";
  const statusColor = isReady ? "text-emerald-600" : "text-amber-600";
  const reportHref = isReady ? `/patient/vault/report?id=${report.id}` : undefined;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group border border-[#E5E7EB]/30 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} ${iconColor}`}>
            <span className="material-symbols-outlined text-[24px]">{icon}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest ${statusBg} ${statusColor}`}
          >
            <span
              className={`w-1 h-1 rounded-full ${isReady ? "" : "animate-pulse"}`}
              style={{ backgroundColor: "currentColor" }}
            />
            {report.status}
          </div>
        </div>
        <div className="space-y-2 mb-10">
          <h5 className="text-xl font-bold text-[#1A1A1E] group-hover:text-[#7F77DD] transition-colors">
            {report.title}
          </h5>
          <p className="text-sm text-[#6B7280]">Ordered by {report.orderedByName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2 text-[#6B7280]/50">
          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          <span className="text-xs font-medium">{report.dateLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          {isReady && reportHref ? (
            <Link
              href={reportHref}
              title="Download File"
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors bg-gray-50 text-[#6B7280] hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </Link>
          ) : (
            <button
              disabled={!isReady}
              title="Download File"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                isReady
                  ? "bg-gray-50 text-[#6B7280] hover:bg-gray-100"
                  : "bg-gray-50 text-[#6B7280]/40 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </button>
          )}
          {isReady && reportHref ? (
            <Link
              href={reportHref}
              className="px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 bg-[#7F77DD]/10 text-[#7F77DD] hover:bg-[#7F77DD] hover:text-white"
            >
              View Report
            </Link>
          ) : (
            <button
              disabled={!isReady}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                isReady
                  ? "bg-[#7F77DD]/10 text-[#7F77DD] hover:bg-[#7F77DD] hover:text-white"
                  : "bg-gray-50 text-[#6B7280]/40 cursor-not-allowed"
              }`}
            >
              {isReady ? "View Report" : "Processing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
