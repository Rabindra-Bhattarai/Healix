"use client";

import { FormEvent, useState } from "react";
import Portal from "@/components/ui/Portal";
import {
  CreateDepartmentInput,
  DepartmentAvailability,
  DepartmentRecord,
  DepartmentTone,
} from "@/lib/departments";
import { ApiError } from "@/lib/api";

const TONES: DepartmentTone[] = ["primary", "secondary", "tertiary", "error"];
const AVAILABILITIES: DepartmentAvailability[] = ["open", "busy", "closed"];

export default function DepartmentFormModal({
  department,
  onClose,
  onSubmit,
}: {
  department?: DepartmentRecord;
  onClose: () => void;
  onSubmit: (input: CreateDepartmentInput) => Promise<void>;
}) {
  const [name, setName] = useState(department?.name ?? "");
  const [slug, setSlug] = useState(department?.slug ?? "");
  const [icon, setIcon] = useState(department?.icon ?? "medical_services");
  const [tone, setTone] = useState<DepartmentTone>(department?.tone ?? "primary");
  const [description, setDescription] = useState(department?.description ?? "");
  const [availability, setAvailability] = useState<DepartmentAvailability>(
    department?.availability ?? "open"
  );
  const [meta, setMeta] = useState(department?.meta ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ name, slug, icon, tone, description, availability, meta });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">
              {department ? "Edit Department" : "Add Department"}
            </h3>
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
              <label className="font-label-sm text-label-sm text-outline">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={Boolean(department)}
                placeholder="cardiology"
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white disabled:opacity-60"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">
                Icon (Material Symbol name)
              </label>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="cardiology"
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as DepartmentTone)}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as DepartmentAvailability)}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                >
                  {AVAILABILITIES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Meta</label>
              <input
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="Estimated wait: 20 mins"
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
              {saving ? "Saving..." : department ? "Save Changes" : "Create Department"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
