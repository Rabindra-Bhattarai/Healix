"use client";

import { FormEvent, useState } from "react";
import { ProfileData } from "@/app/patient/profile/_components/types";
import Portal from "@/components/ui/Portal";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditProfileModal({
  profile,
  onClose,
  onSave,
}: {
  profile: ProfileData;
  onClose: () => void;
  onSave: (profile: ProfileData) => void;
}) {
  const [form, setForm] = useState<ProfileData>(profile);

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <Portal>
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <h3 className="font-h3 text-h3 text-on-surface">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors p-1"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              type="text"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Email Address</label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              type="email"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              type="tel"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Home Address</label>
            <textarea
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Blood Type</label>
            <select
              value={form.bloodType}
              onChange={(e) => update("bloodType", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
            >
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Known Allergies</label>
            <textarea
              value={form.allergies}
              onChange={(e) => update("allergies", e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-outline">Chronic Conditions</label>
            <textarea
              value={form.chronicConditions}
              onChange={(e) => update("chronicConditions", e.target.value)}
              placeholder="Enter chronic conditions..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white resize-none"
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
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
