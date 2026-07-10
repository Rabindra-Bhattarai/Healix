import Link from "next/link";

const COLOR_CLASSES = {
  primary: "bg-primary",
  teal: "bg-action-teal",
  amber: "bg-action-amber",
  neutral: "bg-action-neutral",
} as const;

export default function QuickActionTile({
  href,
  icon,
  label,
  color,
  badge,
}: {
  href: string;
  icon: string;
  label: string;
  color: keyof typeof COLOR_CLASSES;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`relative h-40 rounded-xl p-6 flex flex-col justify-between text-white transition-transform hover:scale-[1.02] ${COLOR_CLASSES[color]}`}
    >
      <span className="material-symbols-outlined text-[26px]">{icon}</span>
      <span className="font-h3 text-h3 tracking-[-0.18px]">{label}</span>
      {badge !== undefined && (
        <span className="absolute top-4 right-4 size-5 rounded-full bg-error text-white text-[12px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}
