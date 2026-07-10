import Link from "next/link";
import Badge from "@/components/ui/Badge";

type Status = "Completed" | "Cancelled";

interface Row {
  date: string;
  practitioner: string;
  initials: string;
  status: Status;
}

const STATUS_VARIANT: Record<Status, "success" | "error"> = {
  Completed: "success",
  Cancelled: "error",
};

export default function RecentAppointmentsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
        <h3 className="font-h3 text-h3 text-on-surface">Recent Appointments</h3>
        <Link href="/patient/appointments" className="font-body-lg text-body-lg text-primary">
          View All
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-container-low/50">
            <th className="text-left font-mono-label text-mono-label uppercase text-on-surface-variant px-6 py-3">
              Date
            </th>
            <th className="text-left font-mono-label text-mono-label uppercase text-on-surface-variant px-6 py-3">
              Practitioner
            </th>
            <th className="text-right font-mono-label text-mono-label uppercase text-on-surface-variant px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i > 0 ? "border-t border-outline-variant/10" : ""}>
              <td className="px-6 py-5 font-body-md text-body-md text-on-surface">{row.date}</td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-[10px] text-on-surface-variant">
                    {row.initials}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    {row.practitioner}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
