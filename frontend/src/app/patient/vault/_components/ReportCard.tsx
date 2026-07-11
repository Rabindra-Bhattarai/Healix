import Link from "next/link";

export interface VaultReport {
  icon: string;
  iconBg: string;
  iconColor: string;
  status: "Ready" | "Pending";
  statusBg: string;
  statusColor: string;
  title: string;
  orderedBy: string;
  date: string;
  reportHref?: string;
}

export default function ReportCard({ report }: { report: VaultReport }) {
  const isReady = report.status === "Ready";

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group border border-[#E5E7EB]/30 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-8">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${report.iconBg} ${report.iconColor}`}
          >
            <span className="material-symbols-outlined text-[24px]">{report.icon}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest ${report.statusBg} ${report.statusColor}`}
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
          <p className="text-sm text-[#6B7280]">Ordered by {report.orderedBy}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2 text-[#6B7280]/50">
          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          <span className="text-xs font-medium">{report.date}</span>
        </div>
        <div className="flex items-center gap-3">
          {isReady && report.reportHref ? (
            <Link
              href={report.reportHref}
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
          {isReady && report.reportHref ? (
            <Link
              href={report.reportHref}
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
