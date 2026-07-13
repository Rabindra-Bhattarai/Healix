export default function HealthPerformanceCard() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[320px] shadow-lg relative overflow-hidden">
      <div className="mb-6">
        <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
          Health Performance Index
        </h3>
        <p className="text-on-surface-variant text-base mt-1">Holistic progression over time</p>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">
          monitoring
        </span>
        <p className="font-bold text-on-surface">Not enough data yet</p>
        <p className="text-on-surface-variant text-sm max-w-sm">
          Your performance index builds up as we track visits, lab results, and check-ins over
          time.
        </p>
      </div>
    </div>
  );
}
