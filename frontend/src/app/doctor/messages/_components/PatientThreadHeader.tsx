export default function PatientThreadHeader({
  patientName,
  onBack,
}: {
  patientName: string;
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
            {patientName}
          </p>
        </div>
      </div>
    </div>
  );
}
