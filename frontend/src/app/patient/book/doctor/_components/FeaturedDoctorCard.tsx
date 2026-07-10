import Link from "next/link";
import { Doctor } from "@/lib/doctors";

export default function FeaturedDoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="relative overflow-hidden bg-primary/5 border border-primary/40 rounded-xl p-8">
      <div className="absolute top-0 left-0 bg-primary text-on-primary px-6 py-2 rounded-br-xl font-label-sm text-label-sm flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]">verified</span>
        Most Recommended
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="w-40 h-40 shrink-0 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/40">
          <span className="material-symbols-outlined text-on-surface-variant text-[64px]">
            person
          </span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div>
              <h3 className="font-h2 text-h2 text-on-surface">{doctor.name}</h3>
              <p className="font-body-lg text-primary font-semibold">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-label-sm font-semibold shrink-0">
              <span className="material-symbols-outlined text-[16px]">star</span>
              {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
            </div>
          </div>
          <div className="flex gap-6 mb-6 font-label-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">history</span>
              {doctor.experienceYears}+ Yrs Exp
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              {doctor.location}
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            {doctor.description}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-3 flex-wrap">
              {doctor.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-surface-container-high rounded-full font-label-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/patient/book/time?doctor=${doctor.slug}`}
              className="px-10 py-3.5 bg-primary text-on-primary rounded-xl font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
