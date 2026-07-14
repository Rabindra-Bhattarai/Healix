"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { DoctorRecord, getAllDoctors } from "@/lib/doctors";
import { DepartmentRecord, getDepartments } from "@/lib/departments";
import { AdminAppointment, AppointmentStatus, getAllAppointmentsAdmin } from "@/lib/appointments";
import { isToday } from "@/lib/doctorAppointments";
import BarListChart from "@/app/admin/_components/BarListChart";
import WeeklyTrendChart, { TrendPoint } from "@/app/admin/_components/WeeklyTrendChart";

const STATUS_VARIANT: Record<AppointmentStatus, "success" | "error" | "neutral"> = {
  Confirmed: "success",
  Completed: "success",
  Cancelled: "error",
};

export default function AdminDashboardPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[] | null>(null);
  const [departments, setDepartments] = useState<DepartmentRecord[] | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointment[] | null>(null);

  useEffect(() => {
    Promise.all([getAllDoctors(), getDepartments(), getAllAppointmentsAdmin()]).then(
      ([d, dept, appts]) => {
        setDoctors(d);
        setDepartments(dept);
        setAppointments(appts);
      }
    );
  }, []);

  if (!doctors || !departments || !appointments) return null;

  const todayCount = appointments.filter((a) => isToday(a.date)).length;
  const recent = [...appointments].reverse().slice(0, 5);

  const statusCounts: Record<AppointmentStatus, number> = {
    Confirmed: 0,
    Completed: 0,
    Cancelled: 0,
  };
  appointments.forEach((a) => {
    statusCounts[a.status] += 1;
  });
  const statusItems = [
    { label: "Confirmed", value: statusCounts.Confirmed, colorClass: "bg-primary" },
    { label: "Completed", value: statusCounts.Completed, colorClass: "bg-secondary" },
    { label: "Cancelled", value: statusCounts.Cancelled, colorClass: "bg-error" },
  ];

  const doctorsByDeptMap = new Map<string, number>();
  doctors.forEach((d) => {
    const name = d.department?.name ?? "Unassigned";
    doctorsByDeptMap.set(name, (doctorsByDeptMap.get(name) ?? 0) + 1);
  });
  const doctorsByDeptItems = Array.from(doctorsByDeptMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const trendPoints: TrendPoint[] = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const count = appointments.filter((a) => new Date(a.date).toDateString() === day.toDateString())
      .length;
    return {
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      value: count,
      isToday: i === 6,
    };
  });

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Dashboard</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          Overview of the hospital&apos;s doctors, departments, and appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid_gutter mb-10">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Doctors
          </p>
          <p className="font-h1 text-h1 text-on-surface">{doctors.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Departments
          </p>
          <p className="font-h1 text-h1 text-on-surface">{departments.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Today&apos;s Appointments
          </p>
          <p className="font-h1 text-h1 text-on-surface">{todayCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid_gutter mb-10">
        <WeeklyTrendChart title="Appointments This Week" points={trendPoints} />
        <BarListChart title="Appointments by Status" items={statusItems} />
      </div>

      <div className="mb-10">
        <BarListChart title="Doctors per Department" items={doctorsByDeptItems} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-h3 text-h3 text-on-surface">Recent Appointments</h3>
        <Link
          href="/admin/appointments"
          className="font-label-sm text-label-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              No appointments yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {recent.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between px-5 sm:px-8 py-4"
              >
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">
                    {appt.patientName}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {appt.doctorName} &bull; {appt.dateLabel}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[appt.status]}>{appt.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
