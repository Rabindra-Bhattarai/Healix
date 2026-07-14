"use client";

import { FormEvent, useEffect, useState } from "react";
import Portal from "@/components/ui/Portal";
import { createDoctorAccount, DoctorRecord } from "@/lib/doctors";
import { getDepartments, DepartmentRecord } from "@/lib/departments";
import { ApiError } from "@/lib/api";

function generatePassword() {
  return Math.random().toString(36).slice(-10);
}

export default function AddDoctorModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (doctor: DoctorRecord) => void;
}) {
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [phone, setPhone] = useState("");
  const [departmentSlug, setDepartmentSlug] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState(1);
  const [location, setLocation] = useState("Tribhuvan University Teaching Hospital");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    getDepartments().then((depts) => {
      setDepartments(depts);
      if (depts.length > 0) setDepartmentSlug(depts[0].slug);
    });
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
      const doctor = await createDoctorAccount({
        name,
        email,
        password,
        departmentSlug,
        specialty,
        phone: phone || undefined,
        experienceYears,
        location,
        description,
        tags,
      });
      onCreated(doctor);
      setCreated({ email, password });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (created) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-secondary text-5xl">
                check_circle
              </span>
              <p className="font-bold text-on-surface">Doctor account created</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Share these credentials with the doctor — the password won&apos;t be shown again.
              </p>
              <div className="w-full bg-surface-container rounded-lg p-4 text-left space-y-1">
                <p className="font-label-sm text-label-sm text-outline">Email</p>
                <p className="font-body-md text-body-md text-on-surface break-all">{created.email}</p>
                <p className="font-label-sm text-label-sm text-outline mt-2">Password</p>
                <p className="font-body-md text-body-md text-on-surface break-all">
                  {created.password}
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
            <h3 className="font-h3 text-h3 text-on-surface">Add Doctor</h3>
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
              <label className="font-label-sm text-label-sm text-outline">Password</label>
              <div className="flex gap-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="flex-1 px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => setPassword(generatePassword())}
                  className="px-3 py-2 border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
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
                placeholder="Cardiology, Preventive Care"
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
              disabled={saving || !departmentSlug}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Doctor"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
