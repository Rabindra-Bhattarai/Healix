"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import {
  DoctorReportRecord,
  DoctorReportStatus,
  getAllDoctorReports,
  updateDoctorReportStatus,
} from "@/lib/doctorReports";
import { setDoctorBlocked } from "@/lib/doctors";

const STATUS_VARIANT: Record<DoctorReportStatus, "warning" | "success" | "neutral"> = {
  Open: "warning",
  Reviewed: "success",
  Dismissed: "neutral",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<DoctorReportRecord[]>([]);
  const [blocking, setBlocking] = useState<DoctorReportRecord | null>(null);

  useEffect(() => {
    getAllDoctorReports().then(setReports);
  }, []);

  async function handleStatusChange(id: string, status: DoctorReportStatus) {
    const updated = await updateDoctorReportStatus(id, status);
    setReports((prev) => prev.map((r) => (r._id === id ? updated : r)));
  }

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Doctor Reports</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          Reports patients have filed against doctors, for review.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">flag</span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No reports</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Reports patients file against doctors will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {reports.map((report) => (
              <div key={report._id} className="flex flex-col gap-3 px-5 sm:px-8 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                      {report.doctorName}
                    </h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Reported by {report.patient?.name ?? "a deleted account"}
                      {report.patient ? ` (${report.patient.email})` : ""} &bull;{" "}
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
                </div>

                <div className="bg-surface-container-low/50 rounded-lg p-3 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <p className="font-label-sm text-label-sm text-primary font-semibold mb-1">
                      {report.category}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {report.description}
                    </p>
                  </div>
                  {report.photoUrl && (
                    <a
                      href={report.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                      title="View full size"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={report.photoUrl}
                        alt="Report evidence"
                        className="w-24 h-24 rounded-lg border border-outline-variant/30 object-cover hover:opacity-80 transition-opacity"
                      />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleStatusChange(report._id, "Reviewed")}
                    disabled={report.status === "Reviewed"}
                    className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleStatusChange(report._id, "Dismissed")}
                    disabled={report.status === "Dismissed"}
                    className="px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => setBlocking(report)}
                    className="px-3 py-1.5 bg-error text-on-error rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
                  >
                    Block Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {blocking && (
        <ConfirmDeleteModal
          title="Block Doctor"
          message={`Are you sure you want to block ${blocking.doctorName}? They will be immediately signed out and unable to log in, and will no longer appear in patient booking searches.`}
          confirmLabel="Block Doctor"
          confirmingLabel="Blocking..."
          onCancel={() => setBlocking(null)}
          onConfirm={async () => {
            await setDoctorBlocked(blocking.doctor, true);
            setBlocking(null);
          }}
        />
      )}
    </div>
  );
}
