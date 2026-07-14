"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { AdminAppointment, AppointmentStatus, getAllAppointmentsAdmin } from "@/lib/appointments";

const STATUS_VARIANT: Record<AppointmentStatus, "success" | "error" | "neutral"> = {
  Confirmed: "success",
  Completed: "success",
  Cancelled: "error",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [dateLabel, setDateLabel] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "">("");

  useEffect(() => {
    getAllAppointmentsAdmin({
      dateLabel: dateLabel || undefined,
      status: status || undefined,
    }).then(setAppointments);
  }, [dateLabel, status]);

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Appointments</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          All appointments across the hospital.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={dateLabel}
          onChange={(e) => setDateLabel(e.target.value)}
          placeholder="Filter by date label..."
          className="h-10 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AppointmentStatus | "")}
          className="h-10 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
        >
          <option value="">All statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="hidden md:grid grid-cols-6 px-8 py-4 bg-surface-container-low/50 border-b border-outline-variant/10">
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Patient
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Doctor
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Date &amp; Time
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Status
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Token
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Specialty
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              event_note
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              No appointments match these filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col gap-2 md:grid md:grid-cols-6 md:items-center px-5 sm:px-8 py-5 md:py-4 hover:bg-surface-container-low/30 transition-colors"
              >
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">
                    {appt.patientName}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {appt.patientEmail}
                  </p>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {appt.doctorName}
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">
                    {appt.dateLabel}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {appt.time}
                  </p>
                </div>
                <div>
                  <Badge variant={STATUS_VARIANT[appt.status]}>{appt.status}</Badge>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  #{appt.queueToken}
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {appt.specialty}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
