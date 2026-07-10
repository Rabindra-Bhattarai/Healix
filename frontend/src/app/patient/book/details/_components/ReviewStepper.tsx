export default function ReviewStepper() {
  return (
    <div className="flex items-center justify-between px-grid_margin">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm">
          1
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">Provider</span>
      </div>
      <div className="flex-grow h-px bg-outline-variant/30 mx-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm">
          2
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">Schedule</span>
      </div>
      <div className="flex-grow h-px bg-primary/30 mx-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm">
          3
        </div>
        <span className="font-label-sm text-label-sm text-primary font-semibold">Review</span>
      </div>
    </div>
  );
}
