export default function ChatThreadHeader({
  doctorName,
  specialty,
  onBack,
}: {
  doctorName: string;
  specialty: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-outline-variant/20">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to conversations"
            className="md:hidden text-on-surface-variant hover:text-primary p-1 -ml-1 mr-1 shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <div className="size-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">person</span>
        </div>
        <div className="min-w-0">
          <p className="font-body-md text-body-md font-semibold text-on-surface truncate">
            {doctorName}
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
            {specialty} &bull; Online
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 text-on-surface-variant shrink-0">
        <button aria-label="Schedule" className="hover:text-primary hidden sm:inline-flex">
          <span className="material-symbols-outlined">calendar_month</span>
        </button>
        <button aria-label="Call" className="hover:text-primary hidden sm:inline-flex">
          <span className="material-symbols-outlined">call</span>
        </button>
        <button aria-label="Details" className="hover:text-primary">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>
    </div>
  );
}
