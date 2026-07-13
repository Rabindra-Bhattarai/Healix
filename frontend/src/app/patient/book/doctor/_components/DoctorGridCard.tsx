import Link from "next/link";
import { Doctor } from "@/lib/doctors";

export default function DoctorGridCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 sm:p-8 hover:border-primary/40 transition-all flex flex-col h-full">
      <div className="flex gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/40">
          <span className="material-symbols-outlined text-on-surface-variant text-[40px]">
            person
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-h3 text-h3 text-on-surface">{doctor.name}</h3>
          <p className="font-body-md text-on-surface-variant">{doctor.specialty}</p>
          <div className="flex items-center gap-2 text-tertiary font-semibold mt-2 text-label-sm">
            <span className="material-symbols-outlined text-[16px]">star</span>
            {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
          </div>
        </div>
      </div>
      <p className="text-body-md text-on-surface-variant flex-grow leading-relaxed mt-6">
        {doctor.description}
      </p>
      <div className="pt-6 mt-6 border-t border-outline-variant/20 flex flex-col gap-4">
        <span className="flex items-center gap-2 font-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">history</span>
          {doctor.experienceYears}+ Yrs Exp
        </span>
        <Link
          href={`/patient/book/time?doctor=${doctor.slug}`}
          className="w-full py-2.5 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 active:scale-95 transition-all text-center"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
