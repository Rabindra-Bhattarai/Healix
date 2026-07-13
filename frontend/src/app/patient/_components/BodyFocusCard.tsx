export default function BodyFocusCard() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[440px] lg:h-[580px] relative shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
          Body Focus
        </h3>
        <p className="text-on-surface-variant text-base mt-1">AI-mapped wellness localization</p>
      </div>

      <div className="relative w-full h-[260px] sm:h-[380px] flex justify-center items-center rounded-[2rem] bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(87,78,177,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(87,78,177,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <svg viewBox="0 0 240 480" className="relative h-full w-auto text-on-surface-variant/20" fill="currentColor">
          <ellipse cx="120" cy="52" rx="27" ry="31" />
          <rect x="106" y="80" width="28" height="20" rx="8" />
          <path d="M63 108c0-13 15-22 57-22s57 9 57 22l6 78c1 11-6 20-17 22l-8 66c-1 11-9 18-19 18h-38c-10 0-18-7-19-18l-8-66c-11-2-18-11-17-22z" />
          <path d="M60 112c-16 4-27 15-30 42l-8 62c-1 9 4 16 12 17s15-4 16-13l10-58c1-6 4-10 8-13z" />
          <path d="M180 112c16 4 27 15 30 42l8 62c1 9-4 16-12 17s-15-4-16-13l-10-58c-1-6-4-10-8-13z" />
          <path d="M100 292h16l-6 128c0 12-4 22-14 22s-15-9-14-21z" />
          <path d="M140 292h-16l6 128c0 12 4 22 14 22s15-9 14-21z" />
        </svg>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
          Primary Focus
        </p>
        <p className="text-sm text-on-surface-variant">
          We&apos;ll highlight a focus area here once we have enough health data.
        </p>
      </div>
    </div>
  );
}
