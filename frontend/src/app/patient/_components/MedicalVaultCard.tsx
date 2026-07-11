import Link from "next/link";

const RECORDS = [
  {
    icon: "lab_panel",
    title: "Annual Blood Panel",
    meta: "Clinical Lab · Oct 12, 2023",
    status: "COMPLETED",
    statusClass: "text-secondary bg-secondary-container/50",
    size: "2.4 MB",
    actionIcon: "download",
    href: "/patient/vault/report",
  },
  {
    icon: "settings_accessibility",
    title: "Cranial MRI Scan",
    meta: "Radiology Dept · Sep 28, 2023",
    status: "PENDING REVIEW",
    statusClass: "text-tertiary bg-tertiary-fixed/50",
    size: "118 MB",
    actionIcon: "visibility",
    href: "/patient/vault",
  },
];

export default function MedicalVaultCard() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[380px] lg:h-[420px] shadow-lg">
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

      <div className="space-y-4">
        {RECORDS.map((record) => (
          <Link
            key={record.title}
            href={record.href}
            className="bg-white border border-outline-variant p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-surface-container-low transition-all group"
          >
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed/40 flex items-center justify-center text-primary transition-transform group-hover:scale-105 shrink-0">
                <span className="material-symbols-outlined text-3xl">{record.icon}</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-on-surface text-lg truncate">{record.title}</h4>
                <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mt-0.5 truncate">
                  {record.meta}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-8 pl-[72px] sm:pl-0">
              <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${record.statusClass}`}>
                {record.status}
              </span>
              <span className="text-on-surface-variant text-sm font-medium">{record.size}</span>
              <span className="material-symbols-outlined text-on-surface-variant p-3 group-hover:bg-surface-container-highest rounded-full transition-colors ml-auto sm:ml-0">
                {record.actionIcon}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}