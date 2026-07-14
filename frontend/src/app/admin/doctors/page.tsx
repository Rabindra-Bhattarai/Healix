"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { DoctorRecord, deleteDoctorRecord, getAllDoctors, setDoctorBlocked } from "@/lib/doctors";
import AddDoctorModal from "@/app/admin/doctors/_components/AddDoctorModal";
import EditDoctorModal from "@/app/admin/doctors/_components/EditDoctorModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorRecord | null>(null);
  const [deleting, setDeleting] = useState<DoctorRecord | null>(null);
  const [blocking, setBlocking] = useState<DoctorRecord | null>(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    getAllDoctors().then(setDoctors);
  }, []);

  const departmentOptions = Array.from(
    new Map(
      doctors
        .filter((d) => d.department)
        .map((d) => [d.department!.slug, d.department!.name])
    ).entries()
  ).sort((a, b) => a[1].localeCompare(b[1]));

  const visibleDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      !search.trim() ||
      doctor.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.trim().toLowerCase()) ||
      (doctor.email ?? "").toLowerCase().includes(search.trim().toLowerCase());
    const matchesDepartment = !departmentFilter || doctor.department?.slug === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-2">Doctors</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Create and manage doctor accounts.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm self-start"
        >
          <span className="material-symbols-outlined">add</span>
          Add Doctor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty, or email..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="h-10 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
        >
          <option value="">All departments</option>
          {departmentOptions.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-8 py-4 bg-surface-container-low/50 border-b border-outline-variant/10">
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Name
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Specialty
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Department
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Rating
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              stethoscope
            </span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No doctors yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Add a doctor account to get started.
            </p>
          </div>
        ) : visibleDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              search_off
            </span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No matching doctors</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Try a different search term or department filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {visibleDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="flex flex-col gap-4 md:grid md:grid-cols-5 md:items-center px-5 sm:px-8 py-5 md:py-6 hover:bg-surface-container-low/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                        {doctor.name}
                      </h4>
                      {doctor.isBlocked && <Badge variant="error">Blocked</Badge>}
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {doctor.email ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {doctor.specialty}
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {doctor.department?.name ?? "—"}
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {doctor.rating.toFixed(1)}
                </div>
                <div className="flex gap-2 justify-start md:justify-end border-t border-outline-variant/10 pt-3 md:border-0 md:pt-0">
                  <button
                    title="Edit"
                    onClick={() => setEditing(doctor)}
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleting(doctor)}
                    className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  {doctor.isBlocked ? (
                    <button
                      title="Unblock"
                      onClick={async () => {
                        const updated = await setDoctorBlocked(doctor._id, false);
                        setDoctors((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
                      }}
                      className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined">lock_open</span>
                    </button>
                  ) : (
                    <button
                      title="Block"
                      onClick={() => setBlocking(doctor)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined">block</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {addOpen && (
        <AddDoctorModal
          onClose={() => setAddOpen(false)}
          onCreated={(doctor) => setDoctors((prev) => [...prev, doctor])}
        />
      )}
      {editing && (
        <EditDoctorModal
          doctor={editing}
          onClose={() => setEditing(null)}
          onUpdated={(updated) =>
            setDoctors((prev) => prev.map((d) => (d._id === updated._id ? updated : d)))
          }
        />
      )}
      {deleting && (
        <ConfirmDeleteModal
          title="Delete Doctor"
          message={`Are you sure you want to delete ${deleting.name}? This will also remove their login account.`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteDoctorRecord(deleting._id);
            setDoctors((prev) => prev.filter((d) => d._id !== deleting._id));
            setDeleting(null);
          }}
        />
      )}
      {blocking && (
        <ConfirmDeleteModal
          title="Block Doctor"
          message={`Are you sure you want to block ${blocking.name}? They will be immediately signed out and unable to log in, and will no longer appear in patient booking searches.`}
          confirmLabel="Block Doctor"
          confirmingLabel="Blocking..."
          onCancel={() => setBlocking(null)}
          onConfirm={async () => {
            const updated = await setDoctorBlocked(blocking._id, true);
            setDoctors((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
            setBlocking(null);
          }}
        />
      )}
    </div>
  );
}
