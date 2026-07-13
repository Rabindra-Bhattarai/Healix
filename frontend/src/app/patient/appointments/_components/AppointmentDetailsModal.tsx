"use client";

import Portal from "@/components/ui/Portal";
import { AppointmentStatus, BookedAppointment } from "@/lib/appointments";

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  Confirmed: "bg-secondary/10 text-secondary border-secondary/20",
  Completed: "bg-secondary/10 text-secondary border-secondary/20",
  Cancelled: "bg-error/10 text-error border-error/20",
};

export default function AppointmentDetailsModal({
  appointment,
  onClose,
}: {
  appointment: BookedAppointment;
  onClose: () => void;
}) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-background/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">Appointment Details</h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-h3 text-h3 text-on-surface">{appointment.doctorName}</p>
                <p className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                  {appointment.specialty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono-label text-mono-label text-outline uppercase">
                  Date &amp; Time
                </label>
                <p className="font-body-md text-body-md text-on-surface">
                  {appointment.dateLabel} &bull; {appointment.time}
                </p>
              </div>
              <div className="space-y-1">
                <label className="font-mono-label text-mono-label text-outline uppercase">
                  Status
                </label>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CLASSES[appointment.status]}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>

            {appointment.status === "Confirmed" && (
              <div className="space-y-1">
                <label className="font-mono-label text-mono-label text-outline uppercase">
                  Queue Token
                </label>
                <p className="font-body-md text-body-md text-on-surface">
                  #{appointment.queueToken}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-mono-label text-mono-label text-outline uppercase">
                Reason for Visit
              </label>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {appointment.reason?.trim() || "No reason provided."}
              </p>
            </div>
          </div>

          <div className="px-6 py-4 bg-surface-container-low flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
