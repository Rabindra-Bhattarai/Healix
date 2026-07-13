import { MessageableDoctor } from "@/lib/appointments";

export default function ConversationList({
  doctors,
  selected,
  onSelect,
  previewText,
  visible = true,
}: {
  doctors: MessageableDoctor[];
  selected: string | null;
  onSelect: (doctorId: string) => void;
  previewText: string;
  visible?: boolean;
}) {
  return (
    <div
      className={`${visible ? "flex" : "hidden"} md:flex w-full md:w-80 shrink-0 border-r border-outline-variant/20 flex-col bg-surface-container-lowest rounded-l-xl`}
    >
      <div className="p-4 border-b border-outline-variant/10">
        <h2 className="font-h3 text-h3 text-primary mb-3">Messages</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            placeholder="Search conversations..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-surface-container-low text-body-md font-body-md outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {doctors.map((doctor) => {
          const active = doctor.doctorId === selected;
          return (
            <button
              key={doctor.doctorId}
              onClick={() => onSelect(doctor.doctorId)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                active ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-surface-container-low"
              }`}
            >
              <div className="size-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body-md text-body-md font-semibold text-on-surface truncate">
                  {doctor.doctorName}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  {doctor.specialty}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate mt-0.5">
                  {previewText}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
