export interface TrendPoint {
  label: string;
  value: number;
  isToday?: boolean;
}

export default function WeeklyTrendChart({
  title,
  points,
}: {
  title: string;
  points: TrendPoint[];
}) {
  const maxValue = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-6">
      <h3 className="font-h3 text-h3 text-on-surface mb-6">{title}</h3>
      <div className="flex items-end justify-between gap-1 sm:gap-2 h-40">
        {points.map((point) => {
          const heightPct = Math.max(4, (point.value / maxValue) * 100);
          return (
            <div key={point.label} className="flex-1 flex flex-col items-center gap-2 h-full">
              <div className="flex-1 w-full flex items-end justify-center">
                <div className="relative w-full max-w-[28px] h-full flex items-end">
                  <div
                    className={`w-full rounded-t-md ${point.isToday ? "bg-primary" : "bg-primary/40"}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant tabular-nums">
                    {point.value}
                  </span>
                </div>
              </div>
              <span
                className={`font-label-sm text-label-sm ${point.isToday ? "text-primary font-semibold" : "text-on-surface-variant"}`}
              >
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
