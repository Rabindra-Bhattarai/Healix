"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import {
  DepartmentRecord,
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "@/lib/departments";
import DepartmentFormModal from "@/app/admin/departments/_components/DepartmentFormModal";

const AVAILABILITY_VARIANT: Record<string, "success" | "warning" | "error"> = {
  open: "success",
  busy: "warning",
  closed: "error",
};

const TONE_CLASSES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
  error: "bg-error/10 text-error",
};

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentRecord | null>(null);
  const [deleting, setDeleting] = useState<DepartmentRecord | null>(null);

  useEffect(() => {
    getDepartments().then(setDepartments);
  }, []);

  return (
    <div className="flex flex-col max-w-content mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-2">Departments</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Manage the hospital&apos;s departments.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm self-start"
        >
          <span className="material-symbols-outlined">add</span>
          Add Department
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-8 py-4 bg-surface-container-low/50 border-b border-outline-variant/10">
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Name
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Slug
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Availability
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider">
            Meta
          </div>
          <div className="font-mono-label text-mono-label text-outline uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">domain</span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No departments yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Add a department to start assigning doctors to it.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="flex flex-col gap-4 md:grid md:grid-cols-5 md:items-center px-5 sm:px-8 py-5 md:py-6 hover:bg-surface-container-low/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[dept.tone]}`}
                  >
                    <span className="material-symbols-outlined">{dept.icon}</span>
                  </div>
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                    {dept.name}
                  </h4>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {dept.slug}
                </div>
                <div>
                  <Badge variant={AVAILABILITY_VARIANT[dept.availability]}>
                    {dept.availability}
                  </Badge>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  {dept.meta || "—"}
                </div>
                <div className="flex gap-2 justify-start md:justify-end border-t border-outline-variant/10 pt-3 md:border-0 md:pt-0">
                  <button
                    title="Edit"
                    onClick={() => setEditing(dept)}
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleting(dept)}
                    className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {addOpen && (
        <DepartmentFormModal
          onClose={() => setAddOpen(false)}
          onSubmit={async (input) => {
            const created = await createDepartment(input);
            setDepartments((prev) => [...prev, created]);
          }}
        />
      )}
      {editing && (
        <DepartmentFormModal
          department={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (input) => {
            const updated = await updateDepartment(editing._id, input);
            setDepartments((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
          }}
        />
      )}
      {deleting && (
        <ConfirmDeleteModal
          title="Delete Department"
          message={`Are you sure you want to delete ${deleting.name}?`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteDepartment(deleting._id);
            setDepartments((prev) => prev.filter((d) => d._id !== deleting._id));
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
