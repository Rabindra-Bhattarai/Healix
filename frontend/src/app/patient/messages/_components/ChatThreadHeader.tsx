export default function ChatThreadHeader({
  doctorName,
  specialty,
}: {
  doctorName: string;
  specialty: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">person</span>
        </div>
        <div>
          <p className="font-body-md text-body-md font-semibold text-on-surface">{doctorName}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {specialty} &bull; Online
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-on-surface-variant">
        <button aria-label="Schedule" className="hover:text-primary">
          <span className="material-symbols-outlined">calendar_month</span>
        </button>
        <button aria-label="Call" className="hover:text-primary">
          <span className="material-symbols-outlined">call</span>
        </button>
        <button aria-label="Details" className="hover:text-primary">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>
    </div>
  );
}
