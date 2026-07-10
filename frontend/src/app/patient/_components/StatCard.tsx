export default function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-[17px] flex flex-col gap-2">
      <span className="font-mono-label text-mono-label uppercase text-on-surface-variant">
        {label}
      </span>
      <span
        className={`font-h2 text-h2 ${accent ? "text-primary" : "text-on-surface"}`}
      >
        {value}
      </span>
    </div>
  );
}
