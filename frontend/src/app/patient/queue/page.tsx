"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QueueStatus, getQueueStatus } from "@/lib/appointments";

const REFRESH_INTERVAL_MS = 20000;

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueStatus | null | undefined>(undefined);

  useEffect(() => {
    function refresh() {
      getQueueStatus().then(setQueue);
    }
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (queue === undefined) return null;

  if (!queue) {
    return (
      <section className="flex flex-col items-center justify-center py-24 max-w-2xl mx-auto w-full text-center">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-primary text-5xl">
            confirmation_number
          </span>
        </div>
        <h3 className="font-h3 text-h3 text-on-surface mb-3">No active queue token</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
          You don&apos;t have a scheduled appointment right now. Book one to get your queue
          token.
        </p>
        <Link
          href="/patient/book"
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          Book Appointment
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto w-full">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 sm:p-12 w-full text-center space-y-8 sm:space-y-10 shadow-sm">
        <div className="space-y-2">
          <span className="font-mono-label text-mono-label text-primary uppercase tracking-[0.2em]">
            Your Queue Token
          </span>
          <h1 className="text-[64px] sm:text-[90px] md:text-[120px] font-extrabold text-primary leading-none tracking-tighter">
            #{queue.queueToken}
          </h1>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-primary text-[32px]">groups</span>
          {queue.peopleAhead === 0 ? (
            <p className="font-h3 text-h3 text-primary">You&apos;re next!</p>
          ) : (
            <p className="font-h3 text-h3 text-primary">
              {queue.peopleAhead} {queue.peopleAhead === 1 ? "person" : "people"} ahead of you
            </p>
          )}
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Updates automatically as the queue moves
          </p>
        </div>

        <div className="h-px w-full bg-outline-variant/20" />

        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          <div className="text-center">
            <p className="font-mono-label text-mono-label text-on-surface-variant uppercase mb-2">
              Appointment Date
            </p>
            <p className="font-h2 text-h2 text-on-surface">{queue.dateLabel}</p>
          </div>
          <div className="text-center border-l border-outline-variant/20">
            <p className="font-mono-label text-mono-label text-on-surface-variant uppercase mb-2">
              Scheduled Time
            </p>
            <p className="font-h2 text-h2 text-on-surface">{queue.time}</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-6 flex items-center justify-center gap-4">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Please check in at the front desk 15 minutes prior to your time.
          </p>
        </div>
      </div>

      <p className="mt-8 font-label-sm text-label-sm text-on-surface-variant text-center">
        Need to reschedule?{" "}
        <Link href="/patient/appointments" className="text-primary font-bold hover:underline">
          Manage Booking
        </Link>
      </p>
    </section>
  );
}
