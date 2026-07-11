"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { findDoctorBySlug } from "@/lib/doctors";
import { getBookingDraft, clearBookingDraft, BookingDraft } from "@/lib/bookingDraft";
import { addAppointment } from "@/lib/appointments";
import ReviewHeader from "@/app/patient/book/details/_components/ReviewHeader";
import ReviewStepper from "@/app/patient/book/details/_components/ReviewStepper";

export default function BookingDetailsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorSlug = searchParams.get("doctor") ?? "";
  const doctor = findDoctorBySlug(doctorSlug);

  const [draft, setDraft] = useState<BookingDraft>({});
  const [reason, setReason] = useState("");

  useEffect(() => {
    setDraft(getBookingDraft());
  }, []);

  function handleConfirm() {
    if (!doctor) return;
    addAppointment({
      doctorName: doctor.name,
      specialty: doctor.specialty,
      dateLabel: draft.dateLabel ?? "TBD",
      time: draft.time ?? "TBD",
      status: "Confirmed",
    });
    clearBookingDraft();
    router.push("/patient/appointments");
  }

  function handleModify() {
    router.push(`/patient/book/time?doctor=${doctorSlug}`);
  }

  if (!doctor) {
    return <p className="font-body-md text-body-md text-on-surface-variant p-8">Doctor not found.</p>;
  }

  return (
    <>
      <ReviewHeader />
      <main className="pt-24 pb-12 px-4 sm:px-container_padding flex justify-center">
        <div className="max-w-[640px] w-full flex flex-col gap-stack_gap_lg">
          <ReviewStepper />

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden">
            <div className="p-container_padding border-b border-outline-variant/10 bg-surface-container-low/50">
              <h2 className="font-h3 text-h3 text-on-surface">Confirm Your Appointment</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Please review the details below before finalizing your booking.
              </p>
            </div>

            <div className="p-container_padding flex flex-col gap-stack_gap_lg">
              <div className="flex items-center gap-stack_gap_md bg-surface-container-low/30 p-4 rounded-lg border border-outline-variant/10">
                <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant/30 shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">
                    person
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-h3 text-h3 text-on-surface">{doctor.name}</span>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                    {doctor.specialty}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">star</span>
                    <span className="font-body-md text-body-md">
                      {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_gap_md">
                <div className="flex flex-col gap-2">
                  <label className="font-mono-label text-mono-label text-outline uppercase">
                    Date &amp; Time
                  </label>
                  <div className="flex items-center gap-stack_gap_sm text-on-surface">
                    <span className="material-symbols-outlined text-primary-container">
                      calendar_month
                    </span>
                    <span className="font-body-lg text-body-lg font-medium">
                      {draft.dateLabel ?? "TBD"} &bull; {draft.time ?? "TBD"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono-label text-mono-label text-outline uppercase">
                    Location
                  </label>
                  <div className="flex items-center gap-stack_gap_sm text-on-surface">
                    <span className="material-symbols-outlined text-primary-container">
                      location_on
                    </span>
                    <span className="font-body-lg text-body-lg font-medium">
                      St. Mary&apos;s Medical Center
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full h-32 bg-surface-container-highest rounded-lg relative overflow-hidden border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-[64px]">
                  map
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary px-3 py-1 rounded-full shadow-lg border-2 border-white">
                    <span className="text-on-primary font-label-sm text-label-sm">
                      Medical Center
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-stack_gap_sm">
                <label className="font-h3 text-h3 text-on-surface" htmlFor="reason">
                  Reason for Visit{" "}
                  <span className="text-on-surface-variant font-body-md">(Optional)</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe your symptoms or the purpose of your visit..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-container_padding bg-surface-container-low/20 border-t border-outline-variant/10 flex flex-col gap-stack_gap_md">
              <button
                onClick={handleConfirm}
                className="w-full h-12 bg-primary text-on-primary font-h3 text-h3 rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Confirm Appointment
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                onClick={handleModify}
                className="w-full h-10 bg-transparent text-on-surface-variant font-body-md text-body-md rounded-lg hover:bg-surface-container-high transition-all"
              >
                Modify Details
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Need help?{" "}
              <a className="text-primary font-semibold hover:underline" href="#">
                Contact Support
              </a>{" "}
              or call (555) 012-3456
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
