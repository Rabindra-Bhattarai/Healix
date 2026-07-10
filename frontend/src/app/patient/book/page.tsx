import Link from "next/link";
import DepartmentCard from "@/app/patient/book/_components/DepartmentCard";
import { DEPARTMENTS } from "@/lib/departments";

export default function DepartmentSelectionPage() {
  return (
    <div className="flex flex-col max-w-content">
      <div className="mb-stack_gap_lg">
        <div className="flex items-center justify-end mb-4">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
            Step 1 of 3: Select Department
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 rounded-full" />
        </div>
      </div>

      <section className="mb-grid_margin">
        <div className="rounded-2xl relative overflow-hidden bg-primary-container p-10 flex flex-col items-start min-h-[320px] justify-center group shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-h1 text-h1 text-on-primary mb-4">Find the right specialist</h1>
            <p className="font-body-lg text-primary-fixed-dim mb-8 text-lg">
              Describe your symptoms and our AI will guide you to the correct department.
            </p>
            <Link
              href="/patient/book/triage"
              className="bg-surface-container-lowest text-primary px-8 py-3.5 rounded-xl font-h3 text-body-md font-bold hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 w-fit"
            >
              Start AI Triage
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-stack_gap_lg">
          <h3 className="font-h3 text-h3 text-on-surface">Available Departments</h3>
          <p className="font-label-sm text-on-surface-variant">
            Showing {DEPARTMENTS.length} major specialists
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_gap_lg">
          {DEPARTMENTS.map((department, i) => (
            <DepartmentCard key={department.slug} department={department} featured={i === 0} />
          ))}
        </div>
      </section>

      <button
        aria-label="Add appointment"
        className="fixed bottom-8 right-8 size-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
}
