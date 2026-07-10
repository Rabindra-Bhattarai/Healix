import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Department, DepartmentAvailability, DepartmentTone } from "@/lib/departments";

const AVAILABILITY_BADGE: Record<DepartmentAvailability, { label: string; variant: "success" | "warning" | "error" }> = {
  open: { label: "OPEN NOW", variant: "success" },
  busy: { label: "BUSY", variant: "warning" },
  closed: { label: "CLOSED", variant: "error" },
};

const TONE_CLASSES: Record<DepartmentTone, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
  error: "bg-error/10 text-error",
};

export default function DepartmentCard({
  department,
  featured = false,
}: {
  department: Department;
  featured?: boolean;
}) {
  const badge = AVAILABILITY_BADGE[department.availability];

  return (
    <Link
      href={`/patient/book/doctor?department=${department.slug}`}
      className={`group bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all ${
        featured ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`size-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${TONE_CLASSES[department.tone]}`}
        >
          <span className="material-symbols-outlined text-[36px]">{department.icon}</span>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>
      <h4 className="font-h2 text-h2 text-on-surface mb-2">{department.name}</h4>
      <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">
        {department.description}
      </p>
      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">schedule</span>
          <span className="font-label-sm">{department.meta}</span>
        </div>
        <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </Link>
  );
}
