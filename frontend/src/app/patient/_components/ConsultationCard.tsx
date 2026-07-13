"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookedAppointment, getAppointments } from "@/lib/appointments";

function initialsFor(name: string) {
  const cleaned = name.replace(/^Dr\.?\s*/i, "").replace(/,.*$/, "");
  const parts = cleaned.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ConsultationCard() {
  const [appointment, setAppointment] = useState<BookedAppointment | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments()
      .then((appointments) => setAppointment(appointments.find((a) => a.status === "Confirmed")))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !appointment) {
    return (
      <div className="bg-primary p-6 sm:p-10 rounded-[2.5rem] text-on-primary flex flex-col items-center justify-center text-center gap-4 min-h-[280px] shadow-[0_20px_50px_-12px_rgba(87,78,177,0.5)] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <span className="material-symbols-outlined text-4xl relative z-10">event_available</span>
        <div className="relative z-10 space-y-1">
          <p className="font-bold text-lg">No upcoming consultations</p>
          <p className="text-white/70 text-sm">Book an appointment to see it here.</p>
        </div>
        <Link
          href="/patient/book"
          className="relative z-10 bg-white text-primary px-6 py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all"
        >
          Book Appointment
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-primary p-6 sm:p-10 rounded-[2.5rem] text-on-primary flex flex-col justify-between min-h-[280px] shadow-[0_20px_50px_-12px_rgba(87,78,177,0.5)] relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />

      {appointment && (
        <>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ring-white/30">
                Upcoming Consultation
              </div>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 shadow-xl flex items-center justify-center text-2xl font-bold">
                {initialsFor(appointment.doctorName)}
              </div>
              <div>
                <h4 className="text-2xl font-extrabold tracking-tight">{appointment.doctorName}</h4>
                <p className="text-white/80 font-medium text-lg">{appointment.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-10">
              <div>
                <p className="text-[11px] font-bold uppercase opacity-60 tracking-widest">Date</p>
                <p className="text-lg font-black">{appointment.dateLabel}</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-[11px] font-bold uppercase opacity-60 tracking-widest">Time</p>
                <p className="text-lg font-black">{appointment.time}</p>
              </div>
            </div>
          </div>

          <Link
            href="/patient/appointments"
            className="relative z-10 w-full bg-white text-primary py-5 rounded-3xl font-black uppercase tracking-[0.15em] text-sm hover:scale-[1.02] hover:shadow-2xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
          >
            <span className="material-symbols-outlined transition-transform group-hover:scale-110">
              calendar_month
            </span>
            View Appointment
          </Link>
        </>
      )}
    </div>
  );
}
