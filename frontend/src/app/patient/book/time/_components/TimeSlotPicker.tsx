"use client";

const MORNING_SLOTS = [
  { time: "08:30 AM", disabled: false },
  { time: "09:15 AM", disabled: false },
  { time: "10:00 AM", disabled: false },
  { time: "11:30 AM", disabled: true },
];

const AFTERNOON_SLOTS = [
  { time: "01:45 PM", disabled: false },
  { time: "02:30 PM", disabled: false },
  { time: "03:15 PM", disabled: false },
  { time: "04:00 PM", disabled: false },
];

function SlotGroup({
  label,
  icon,
  slots,
  selectedSlot,
  onSelectSlot,
}: {
  label: string;
  icon: string;
  slots: { time: string; disabled: boolean }[];
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}) {
  return (
    <div>
      <h4 className="text-label-sm font-mono-label text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
        {label}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.time}
            disabled={slot.disabled}
            onClick={() => onSelectSlot(slot.time)}
            className={`p-3 text-center rounded-lg font-medium transition-all ${
              slot.disabled
                ? "border border-outline-variant/30 bg-surface-container/50 text-on-surface-variant/40 cursor-not-allowed italic"
                : slot.time === selectedSlot
                  ? "bg-primary text-on-primary border border-primary font-bold shadow-sm"
                  : "border border-outline-variant/30 hover:border-primary hover:bg-primary/5 text-on-surface"
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TimeSlotPicker({
  dateLabel,
  selectedSlot,
  onSelectSlot,
  onContinue,
  onBack,
}: {
  dateLabel: string;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 sm:p-8 flex-1 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="font-h3 text-h3 mb-1">Select Time Slot</h3>
        <p className="text-body-md font-body-md text-on-surface-variant">{dateLabel}</p>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto">
        <SlotGroup
          label="Morning"
          icon="wb_sunny"
          slots={MORNING_SLOTS}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
        <SlotGroup
          label="Afternoon"
          icon="wb_twilight"
          slots={AFTERNOON_SLOTS}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
      </div>

      <div className="mt-8 pt-8 border-t border-outline-variant/20 space-y-3">
        <button
          onClick={onContinue}
          className="w-full h-12 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-colors shadow-md shadow-primary/10 active:scale-[0.98]"
        >
          Continue to Review
        </button>
        <button
          onClick={onBack}
          className="w-full h-12 bg-surface-container-lowest text-on-surface border border-outline-variant/20 font-semibold rounded-lg hover:bg-surface-container-low transition-colors active:scale-[0.98]"
        >
          Back
        </button>
      </div>
    </section>
  );
}
