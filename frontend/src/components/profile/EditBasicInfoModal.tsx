"use client";

import { FormEvent, useState } from "react";
import Portal from "@/components/ui/Portal";
import { updateBasicProfile } from "@/lib/security";
import { ApiError } from "@/lib/api";

export default function EditBasicInfoModal({
  name,
  email,
  phone,
  onClose,
  onSaved,
}: {
  name: string;
  email: string;
  phone: string;
  onClose: () => void;
  onSaved: (data: { name: string; email: string; phone: string }) => void;
}) {
  const [form, setForm] = useState({ name, email, phone });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateBasicProfile(form);
      onSaved(form);
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
        <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">Edit Personal Information</h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
