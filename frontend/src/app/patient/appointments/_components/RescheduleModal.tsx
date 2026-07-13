"use client";

import { useState } from "react";
import Portal from "@/components/ui/Portal";
import { BookedAppointment, rescheduleAppointment } from "@/lib/appointments";
import { ApiError } from "@/lib/api";

const TIME_SLOTS = [
  "08:30 AM",
  "09:15 AM",
  "10:00 AM",
  "11:30 AM",
  "01:45 PM",
  "02:30 PM",
  "03:15 PM",
  "04:00 PM",
];

export default function RescheduleModal({
  appointment,
  onClose,
  onRescheduled,
}: {
  appointment: BookedAppointment;
  onClose: () => void;
  onRescheduled: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    if (!date || !time) {
      setError("Please choose both a date and a time.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const selected = new Date(`${date}T00:00:00`);
      const dateLabel = selected.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      await rescheduleAppointment(appointment.id, {
        date: selected.toISOString(),
        dateLabel,
        time,
      });
      onRescheduled();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-background/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface">Reschedule Appointment</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                {appointment.doctorName} &bull; {appointment.specialty}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <label
                className="font-label-sm text-label-sm text-on-surface-variant"
                htmlFor="reschedule-date"
              >
                New Date
              </label>
              <input
                id="reschedule-date"
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-outline-variant rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">New Time</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`p-2.5 text-center rounded-lg font-medium text-sm transition-all border ${
                      time === slot
                        ? "bg-primary text-on-primary border-primary font-bold shadow-sm"
                        : "border-outline-variant/40 hover:border-primary hover:bg-primary/5 text-on-surface"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
