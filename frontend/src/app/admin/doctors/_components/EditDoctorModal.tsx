"use client";

import { FormEvent, useEffect, useState } from "react";
import Portal from "@/components/ui/Portal";
import { DoctorRecord, updateDoctorRecord } from "@/lib/doctors";
import { getDepartments, DepartmentRecord } from "@/lib/departments";
import { ApiError } from "@/lib/api";

function generatePassword() {
  return Math.random().toString(36).slice(-10);
}

export default function EditDoctorModal({
  doctor,
  onClose,
  onUpdated,
}: {
  doctor: DoctorRecord;
  onClose: () => void;
  onUpdated: (doctor: DoctorRecord) => void;
}) {
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [name, setName] = useState(doctor.name);
  const [email, setEmail] = useState(doctor.email ?? "");
  const [phone, setPhone] = useState(doctor.phone ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [departmentSlug, setDepartmentSlug] = useState(doctor.department?.slug ?? "");
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [experienceYears, setExperienceYears] = useState(doctor.experienceYears);
  const [location, setLocation] = useState(doctor.location);
  const [description, setDescription] = useState(doctor.description);
  const [tagsInput, setTagsInput] = useState((doctor.tags ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetPassword, setResetPassword] = useState<string | null>(null);

  useEffect(() => {
    getDepartments().then(setDepartments);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const updated = await updateDoctorRecord(doctor._id, {
        name,
        email,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(newPassword.trim() ? { password: newPassword.trim() } : {}),
        departmentSlug,
        specialty,
        experienceYears,
        location,
        description,
        tags,
      });
      onUpdated(updated);
      if (newPassword.trim()) {
        setResetPassword(newPassword.trim());
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (resetPassword) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-secondary text-5xl">
                check_circle
              </span>
              <p className="font-bold text-on-surface">Password reset</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Share this new password with the doctor — it won&apos;t be shown again.
              </p>
              <div className="w-full bg-surface-container rounded-lg p-4 text-left space-y-1">
                <p className="font-label-sm text-label-sm text-outline">New Password</p>
                <p className="font-body-md text-body-md text-on-surface break-all">
                  {resetPassword}
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">Edit Doctor</h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Reset Password</label>
              <div className="flex gap-2">
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  placeholder="Leave blank to keep unchanged"
                  className="flex-1 px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => setNewPassword(generatePassword())}
                  className="px-3 py-2 border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Department</label>
              <select
                value={departmentSlug}
                onChange={(e) => setDepartmentSlug(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept.slug} value={dept.slug}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Specialty</label>
              <input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Experience (years)</label>
              <input
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Bio</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">
                Tags (comma-separated)
              </label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
          </form>

          <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
