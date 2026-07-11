"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { saveBookingDraft } from "@/lib/bookingDraft";
import DateCalendar from "@/app/patient/book/time/_components/DateCalendar";
import TimeSlotPicker from "@/app/patient/book/time/_components/TimeSlotPicker";

const YEAR = 2023;
const MONTH_INDEX = 9; // October

export default function BookingTimeView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorSlug = searchParams.get("doctor") ?? "";

  const [selectedDay, setSelectedDay] = useState(11);
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");

  const selectedDate = new Date(YEAR, MONTH_INDEX, selectedDay);
  const dateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  function handleContinue() {
    saveBookingDraft({
      doctorSlug,
      date: selectedDate.toISOString(),
      dateLabel,
      time: selectedSlot,
    });
    router.push(`/patient/book/details?doctor=${doctorSlug}`);
  }

  function handleBack() {
    router.back();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="font-h2 text-h2 text-on-surface">Step 2 of 3: Schedule Date &amp; Time</h2>
          <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">
            Completed
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid_gutter">
        <div className="lg:col-span-8 space-y-grid_gutter">
          <DateCalendar
            year={YEAR}
            monthIndex={MONTH_INDEX}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col h-full">
          <TimeSlotPicker
            dateLabel={dateLabel}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-surface-container-low/50 rounded-lg border-l-4 border-primary/40 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary">info</span>
        <p className="text-body-md text-on-surface-variant">
          All appointment times are shown in your local timezone (EST). A confirmation email will
          be sent once the booking is finalized in the next step.
        </p>
      </div>
    </div>
  );
}
