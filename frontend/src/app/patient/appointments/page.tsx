"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppointmentStatus,
  BookedAppointment,
  cancelAppointment,
  getAppointments,
} from "@/lib/appointments";

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  Confirmed: "bg-secondary/10 text-secondary border-secondary/20",
  Completed: "bg-secondary/10 text-secondary border-secondary/20",
  Cancelled: "bg-error/10 text-error border-error/20",
};

const STATUS_DOT_CLASSES: Record<AppointmentStatus, string> = {
  Confirmed: "bg-secondary",
  Completed: "bg-secondary",
  Cancelled: "bg-error",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);

  useEffect(() => {
    setAppointments(getAppointments());
  }, []);

  function handleCancel(id: string) {
    cancelAppointment(id);
    setAppointments(getAppointments());
  }

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-2">My Appointments</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Manage your upcoming clinical visits, specialist consultations, and medical
            screenings in one centralized view.
          </p>
        </div>
        <Link
          href="/patient/book"
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm self-start"
        >
          <span className="material-symbols-outlined">add</span>
          Add Appointment
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div
          className={`hidden md:grid ${appointments.length ? "grid-cols-5" : "grid-cols-4"} px-8 py-4 bg-surface-container-low/50 border-b border-outline-variant/10`}
        >
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Doctor
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Department
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Date &amp; Time
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Status
          </div>
          {appointments.length > 0 && (
            <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider text-right">
              Actions
            </div>
          )}
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">
                  event_busy
                </span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-lg">
                  medical_services
                </span>
              </div>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-3">No appointments scheduled yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
              You haven&apos;t booked any medical consultations or follow-ups yet. Your upcoming
              appointments will appear here once booked. Click &apos;Add Appointment&apos; to get
              started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col gap-4 md:grid md:grid-cols-5 md:items-center px-5 sm:px-8 py-5 md:py-6 hover:bg-surface-container-low/30 transition-colors group"
              >
                <div className="flex items-center justify-between md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                      {appt.doctorName}
                    </h4>
                  </div>
                  <span
                    className={`md:hidden inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CLASSES[appt.status]}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT_CLASSES[appt.status]}`}
                    />
                    {appt.status}
                  </span>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {appt.specialty}
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">
                    {appt.dateLabel}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {appt.time}
                  </p>
                </div>
                <div className="hidden md:flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CLASSES[appt.status]}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT_CLASSES[appt.status]}`}
                    />
                    {appt.status}
                  </span>
                </div>
                <div className="flex gap-2 justify-end border-t border-outline-variant/10 pt-3 md:border-0 md:pt-0">
                  <button
                    title="View Details"
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  <button
                    title="Reschedule"
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">event_repeat</span>
                  </button>
                  <button
                    title="Cancel Appointment"
                    onClick={() => handleCancel(appt.id)}
                    className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
