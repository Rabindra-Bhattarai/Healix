import StatCard from "@/app/patient/_components/StatCard";
import QuickActionTile from "@/app/patient/_components/QuickActionTile";
import LiveQueueWidget from "@/app/patient/_components/LiveQueueWidget";
import RecentAppointmentsTable from "@/app/patient/_components/RecentAppointmentsTable";

const RECENT_APPOINTMENTS = [
  { date: "Oct 20, 2023", practitioner: "Dr. Aris", initials: "DA", status: "Completed" as const },
  { date: "Oct 15, 2023", practitioner: "Dr. Sarah", initials: "DS", status: "Cancelled" as const },
  { date: "Oct 10, 2023", practitioner: "Dr. Julian", initials: "DJ", status: "Completed" as const },
];

export default function PatientDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-content">
      <div>
        <h1 className="font-h1 text-h1 text-on-surface">Good morning, Julian.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is your health overview for Oct 24.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Active Token" value="14" accent />
        <StatCard label="Next Appointment" value="Oct 24" />
        <StatCard label="Visits This Year" value="8" />
        <StatCard label="Vault Docs" value="12" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-6">
          <QuickActionTile
            href="/patient/appointments"
            icon="calendar_add_on"
            label="Book Appointment"
            color="primary"
          />
          <QuickActionTile href="/patient/queue" icon="reorder" label="My Queue" color="teal" />
          <QuickActionTile href="/patient/vault" icon="lock" label="Health Vault" color="amber" />
          <QuickActionTile
            href="/patient/messages"
            icon="chat"
            label="Messages"
            color="neutral"
            badge={3}
          />
        </div>
        <LiveQueueWidget tokenNumber={42} positionLabel="3rd in line" waitMinutes={15} waitPercent={33} />
      </div>

      <RecentAppointmentsTable rows={RECENT_APPOINTMENTS} />
    </div>
  );
}
