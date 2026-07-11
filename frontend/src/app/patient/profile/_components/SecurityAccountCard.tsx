const ROWS = [
  {
    icon: "lock_reset",
    title: "Change Password",
    subtitle: "Last changed 4 months ago",
    subtitleClass: "text-outline",
  },
  {
    icon: "security",
    title: "Two-Factor Authentication",
    subtitle: "Enabled (SMS & Email)",
    subtitleClass: "text-secondary font-semibold",
  },
];

export default function SecurityAccountCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-container_padding">
      <h3 className="font-h3 text-h3 text-on-surface mb-6">Security &amp; Account</h3>
      <div className="space-y-4">
        {ROWS.map((row) => (
          <button
            key={row.title}
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-outline-variant/20 hover:bg-surface-container transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-surface-container p-2 rounded-lg group-hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">
                  {row.icon}
                </span>
              </div>
              <div className="text-left">
                <p className="font-body-lg text-body-lg text-on-surface font-medium">
                  {row.title}
                </p>
                <p className={`font-label-sm text-label-sm ${row.subtitleClass}`}>
                  {row.subtitle}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );
}
