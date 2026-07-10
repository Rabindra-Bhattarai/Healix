export default function LiveQueueWidget({
  tokenNumber,
  positionLabel,
  waitMinutes,
  waitPercent,
}: {
  tokenNumber: number;
  positionLabel: string;
  waitMinutes: number;
  waitPercent: number;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 border-l-4 border-l-primary rounded-xl pl-7 pr-6 py-6 flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-mono-label uppercase text-on-surface-variant">
            Live Queue Status
          </span>
          <span className="size-2 rounded-full bg-primary" />
        </div>
        <p className="font-h1 text-h1 text-on-surface pt-3">Token #{tokenNumber}</p>
        <p className="font-body-md text-body-md font-semibold text-primary">{positionLabel}</p>
        <div className="flex flex-col gap-2 pt-5">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Est. Wait</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {waitMinutes} mins
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${waitPercent}%` }} />
          </div>
        </div>
      </div>
      <div className="bg-primary/5 rounded-lg p-4 flex gap-3 items-start mt-5">
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
          info
        </span>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Safe to leave home. We&apos;ll notify you when you are 1st in line.
        </p>
      </div>
    </div>
  );
}
