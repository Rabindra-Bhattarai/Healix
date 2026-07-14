"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAppointments } from "@/lib/appointments";
import type { BodyRegion } from "@/components/three/BodyModel3D";

const BodyModel3D = dynamic(() => import("@/components/three/BodyModel3D"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl animate-pulse">
        person
      </span>
    </div>
  ),
});

const REGION_LABEL: Record<BodyRegion, string> = {
  head: "Head & Neurological",
  torso: "Chest & Core",
  limbs: "Musculoskeletal",
};

const REGION_TAG: Record<BodyRegion, string> = {
  head: "NEUROLOGICAL",
  torso: "CARDIOVASCULAR",
  limbs: "MUSCULOSKELETAL",
};

function inferRegion(specialty: string): BodyRegion | null {
  const s = specialty.toLowerCase();
  if (/cardio|pulmo|gastro|nephro|onco|surg|obstet|gynec/.test(s)) return "torso";
  if (/neuro|psychiat|ophthalm|ent|otolaryng/.test(s)) return "head";
  if (/ortho/.test(s)) return "limbs";
  return null;
}

export default function BodyFocusCard() {
  const [focusRegion, setFocusRegion] = useState<BodyRegion | null | undefined>(undefined);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    getAppointments().then((appointments) => {
      const counts: Record<BodyRegion, number> = { head: 0, torso: 0, limbs: 0 };
      appointments
        .filter((a) => a.status !== "Cancelled")
        .forEach((a) => {
          const region = inferRegion(a.specialty);
          if (region) counts[region] += 1;
        });

      const top = (Object.entries(counts) as [BodyRegion, number][]).sort((a, b) => b[1] - a[1])[0];
      setFocusRegion(top && top[1] > 0 ? top[0] : null);
    });
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-6 sm:p-10 min-h-[440px] lg:h-[580px] relative shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] font-semibold text-on-surface">
          Body Focus
        </h3>
        <p className="text-on-surface-variant text-base mt-1">Based on your visit history — drag to rotate</p>
      </div>

      <div className="relative w-full h-[260px] sm:h-[380px] rounded-[2rem] bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(87,78,177,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(87,78,177,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {focusRegion && (
          <span className="absolute top-4 left-4 z-10 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            {REGION_TAG[focusRegion]}
          </span>
        )}

        {focusRegion !== undefined && (
          <BodyModel3D key={resetCount} focusRegion={focusRegion} />
        )}

        <button
          onClick={() => setResetCount((c) => c + 1)}
          title="Reset view"
          className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">center_focus_weak</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
          Primary Focus
        </p>
        <p className="text-sm text-on-surface-variant">
          {focusRegion === undefined
            ? " "
            : focusRegion
              ? REGION_LABEL[focusRegion]
              : "We'll highlight a focus area here once you've had a visit."}
        </p>
      </div>
    </div>
  );
}
