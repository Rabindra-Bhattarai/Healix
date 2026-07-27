"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { DoctorAppointment, getMyDoctorAppointments, setAppointmentStatus } from "@/lib/doctorAppointments";
import { AppointmentStatus } from "@/lib/appointments";
import AddVaultReportModal from "@/app/doctor/appointments/_components/AddVaultReportModal";

const STATUS_VARIANT: Record<AppointmentStatus, "success" | "error" | "neutral"> = {
  Confirmed: "success",
  Completed: "success",
  Cancelled: "error",
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [addingReportFor, setAddingReportFor] = useState<DoctorAppointment | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("");

  useEffect(() => {
    getMyDoctorAppointments().then(setAppointments);
  }, []);

  async function handleStatus(id: string, status: AppointmentStatus) {
    const updated = await setAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  const visibleAppointments = appointments.filter((appt) => {
    const matchesSearch =
      !search.trim() ||
      appt.patientName.toLowerCase().includes(search.trim().toLowerCase()) ||
      appt.patientEmail.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !statusFilter || appt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Appointments</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          All appointments booked with you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name or email..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | "")}
          className="h-10 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
        >
          <option value="">All statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-8 py-4 bg-surface-container-low/50 border-b border-outline-variant/10">
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Patient
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Date &amp; Time
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Reason
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Status
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              event_busy
            </span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No appointments yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Appointments patients book with you will appear here.
            </p>
          </div>
        ) : visibleAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              search_off
            </span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No matching appointments</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Try a different search term or status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {visibleAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col gap-4 md:grid md:grid-cols-5 md:items-center px-5 sm:px-8 py-5 md:py-6 hover:bg-surface-container-low/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                      {appt.patientName}
                    </h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {appt.patientEmail}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">
                    {appt.dateLabel}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {appt.time}
                  </p>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {appt.reason || "—"}
                </div>
                <div>
                  <Badge variant={STATUS_VARIANT[appt.status]}>{appt.status}</Badge>
                </div>
                <div className="flex gap-2 justify-start md:justify-end border-t border-outline-variant/10 pt-3 md:border-0 md:pt-0">
                  <button
                    onClick={() => handleStatus(appt.id, "Completed")}
                    disabled={appt.status !== "Confirmed"}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatus(appt.id, "Cancelled")}
                    disabled={appt.status !== "Confirmed"}
                    className="px-3 py-1.5 text-error hover:bg-error/5 rounded-lg font-label-sm text-label-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    title={appt.patientId ? "Add Vault Report" : "Patient account no longer exists"}
                    onClick={() => setAddingReportFor(appt)}
                    disabled={!appt.patientId}
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">note_add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {addingReportFor && (
        <AddVaultReportModal
          patientId={addingReportFor.patientId}
          patientName={addingReportFor.patientName}
          onClose={() => setAddingReportFor(null)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}
