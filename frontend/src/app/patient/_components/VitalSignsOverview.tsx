export default function VitalSignsOverview() {
  return (
    <section className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
          <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
            Vital Signs Overview
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
          No data yet
        </span>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">
          monitor_heart
        </span>
        <p className="font-bold text-on-surface">No vitals recorded yet</p>
        <p className="text-on-surface-variant text-sm max-w-sm">
          Your heart rate, blood pressure, and SpO2 readings will appear here after your first
          check-up or device sync.
        </p>
      </div>
    </section>
  );
}
