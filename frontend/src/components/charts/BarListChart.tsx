export interface BarListItem {
  label: string;
  value: number;
  colorClass?: string;
}

export default function BarListChart({
  title,
  items,
  defaultColorClass = "bg-primary",
}: {
  title: string;
  items: BarListItem[];
  defaultColorClass?: string;
}) {
  const maxValue = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-6">
      <h3 className="font-h3 text-h3 text-on-surface mb-5">{title}</h3>
      {items.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">No data yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const widthPct = Math.max(2, (item.value / maxValue) * 100);
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-20 sm:w-36 shrink-0 truncate font-label-sm text-label-sm text-on-surface-variant">
                  {item.label}
                </span>
                <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.colorClass ?? defaultColorClass}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right font-label-sm text-label-sm font-semibold text-on-surface tabular-nums">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
