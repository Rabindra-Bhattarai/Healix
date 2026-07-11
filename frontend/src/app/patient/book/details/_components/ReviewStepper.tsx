export default function ReviewStepper() {
  return (
    <div className="flex items-center justify-between px-4 sm:px-grid_margin">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm shrink-0">
          1
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
          Provider
        </span>
      </div>
      <div className="flex-grow h-px bg-outline-variant/30 mx-2 sm:mx-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm shrink-0">
          2
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
          Schedule
        </span>
      </div>
      <div className="flex-grow h-px bg-primary/30 mx-2 sm:mx-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm shrink-0">
          3
        </div>
        <span className="font-label-sm text-label-sm text-primary font-semibold hidden sm:inline">
          Review
        </span>
      </div>
    </div>
  );
}
