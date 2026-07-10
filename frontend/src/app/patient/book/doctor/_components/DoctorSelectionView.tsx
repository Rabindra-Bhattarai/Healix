"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDepartment } from "@/lib/departments";
import { DOCTORS_BY_DEPARTMENT } from "@/lib/doctors";
import FeaturedDoctorCard from "@/app/patient/book/doctor/_components/FeaturedDoctorCard";
import DoctorGridCard from "@/app/patient/book/doctor/_components/DoctorGridCard";

export default function DoctorSelectionView() {
  const searchParams = useSearchParams();
  const departmentSlug = searchParams.get("department") ?? "cardiology";
  const department = getDepartment(departmentSlug);
  const doctors = DOCTORS_BY_DEPARTMENT[departmentSlug] ?? [];
  const [featured, ...rest] = doctors;

  return (
    <div className="flex flex-col max-w-content">
      <div className="mb-stack_gap_lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-h1 text-h1 text-on-surface">
            {department?.name ?? "Department"} Specialists
          </h1>
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
            Step 2 of 3: Select Specialist
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3 rounded-full" />
        </div>
      </div>

      <div className="flex items-center mb-stack_gap_lg">
        <div className="ml-auto flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[18px]">sort</span>
          Sort by: Highest Rated
        </div>
      </div>

      <div className="flex flex-col gap-stack_gap_lg">
        {featured && <FeaturedDoctorCard doctor={featured} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_gap_lg">
          {rest.map((doctor) => (
            <DoctorGridCard key={doctor.slug} doctor={doctor} />
          ))}
        </div>

        <div className="flex items-center justify-between py-6 border-t border-outline-variant/20">
          <Link
            href="/patient/book"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-all font-semibold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Previous
          </Link>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-2 h-2 rounded-full bg-outline-variant/30" />
            <span className="w-2 h-2 rounded-full bg-outline-variant/30" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-all font-semibold">
            Next
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
