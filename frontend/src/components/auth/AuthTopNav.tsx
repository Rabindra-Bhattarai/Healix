interface AuthTopNavProps {
  crumb: string;
  step?: {
    current: number;
    total: number;
    label: string;
  };
}

export default function AuthTopNav({ crumb, step }: AuthTopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-surface-container-lowest border-b border-outline-variant/20 flex items-center justify-between px-4 sm:px-grid_margin">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold text-2xl tracking-[-0.24px] text-primary shrink-0">Healix</span>
        <span className="text-body-lg text-outline-variant hidden sm:inline">|</span>
        <span className="font-body-md text-body-md text-on-surface-variant hidden sm:inline truncate">
          {crumb}
        </span>
      </div>
      {step && (
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.6px]">
              Step {step.current} of {step.total}
            </span>
            <span className="font-body-md text-body-md font-semibold text-on-surface hidden sm:inline">
              {step.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: step.total }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 sm:w-16 rounded-full ${i < step.current ? "bg-primary" : "bg-surface-container-highest"}`}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
