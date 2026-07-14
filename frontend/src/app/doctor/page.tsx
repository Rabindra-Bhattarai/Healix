"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import {
  DoctorAppointment,
  getMyDoctorAppointments,
  isToday,
  setAppointmentStatus,
} from "@/lib/doctorAppointments";
import { AppointmentStatus } from "@/lib/appointments";

const STATUS_VARIANT: Record<AppointmentStatus, "success" | "error" | "neutral"> = {
  Confirmed: "success",
  Completed: "success",
  Cancelled: "error",
};

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<DoctorAppointment[] | null>(null);

  useEffect(() => {
    getMyDoctorAppointments().then(setAppointments);
  }, []);

  async function handleStatus(id: string, status: AppointmentStatus) {
    const updated = await setAppointmentStatus(id, status);
    setAppointments((prev) => prev?.map((a) => (a.id === id ? updated : a)) ?? prev);
  }

  if (appointments === null) return null;

  const today = appointments.filter((a) => isToday(a.date));
  const todayConfirmed = today.filter((a) => a.status === "Confirmed").length;
  const upcoming = appointments.filter((a) => a.status === "Confirmed").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Dashboard</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          Your appointments and patient activity at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid_gutter mb-10">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Today
          </p>
          <p className="font-h1 text-h1 text-on-surface">{todayConfirmed}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Upcoming
          </p>
          <p className="font-h1 text-h1 text-on-surface">{upcoming}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Completed
          </p>
          <p className="font-h1 text-h1 text-on-surface">{completed}</p>
        </div>
      </div>

      <h3 className="font-h3 text-h3 text-on-surface mb-4">Today&apos;s Appointments</h3>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        {today.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              event_available
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              No appointments scheduled for today.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {today.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-8 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      {appt.patientName}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {appt.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-3">
                  <Badge variant={STATUS_VARIANT[appt.status]}>{appt.status}</Badge>
                  {appt.status === "Confirmed" && (
                    <>
                      <button
                        onClick={() => handleStatus(appt.id, "Completed")}
                        className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleStatus(appt.id, "Cancelled")}
                        className="px-3 py-1.5 text-error hover:bg-error/5 rounded-lg font-label-sm text-label-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
