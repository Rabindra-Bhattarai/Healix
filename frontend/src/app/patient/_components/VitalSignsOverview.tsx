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
          Last sync: Just now
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white border border-outline-variant rounded-3xl p-6 flex flex-col justify-between h-48 hover:border-primary hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-error-container/50 rounded-2xl">
              <span
                className="material-symbols-outlined text-error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">
              Real-time
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-on-surface-variant uppercase text-[11px] font-bold tracking-widest mb-1">
                Heart Rate
              </p>
              <h3 className="text-[30px] sm:text-[40px] leading-none tracking-[-0.04em] font-medium text-on-surface">
                72 <span className="text-lg text-on-surface-variant font-normal">BPM</span>
              </h3>
            </div>
            <div className="w-24 h-12">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <path
                  d="M0 20 L10 20 L15 5 L25 35 L35 20 L50 20 L55 5 L65 35 L75 20 L100 20"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeWidth="2.5"
                  style={{ filter: "drop-shadow(0 0 3px rgba(186,26,26,0.4))" }}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-3xl p-6 flex flex-col justify-between h-48 hover:border-primary hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary-fixed/60 rounded-2xl">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                blood_pressure
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary-container/50 px-2 py-1 rounded-full">
              Optimal
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-on-surface-variant uppercase text-[11px] font-bold tracking-widest mb-1">
                Blood Pressure
              </p>
              <h3 className="text-[30px] sm:text-[40px] leading-none tracking-[-0.04em] font-medium text-on-surface">
                118/76 <span className="text-lg text-on-surface-variant font-normal">mmHg</span>
              </h3>
            </div>
            <div className="w-20 h-10 flex items-end gap-1.5">
              <div className="w-2.5 h-4 bg-primary/10 rounded-full" />
              <div className="w-2.5 h-6 bg-primary/25 rounded-full" />
              <div className="w-2.5 h-8 bg-primary/50 rounded-full" />
              <div className="w-2.5 h-10 bg-primary rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-3xl p-6 flex flex-col justify-between h-48 hover:border-primary hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-secondary-container/50 rounded-2xl">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                air
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40">more_horiz</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-on-surface-variant uppercase text-[11px] font-bold tracking-widest mb-1">
                SpO2 Level
              </p>
              <h3 className="text-[30px] sm:text-[40px] leading-none tracking-[-0.04em] font-medium text-on-surface">
                99.2 <span className="text-lg text-on-surface-variant font-normal">%</span>
              </h3>
            </div>
            <div className="text-secondary flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              0.4%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}