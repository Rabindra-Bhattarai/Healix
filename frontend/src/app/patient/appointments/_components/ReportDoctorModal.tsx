"use client";

import { FormEvent, useRef, useState } from "react";
import Portal from "@/components/ui/Portal";
import { DOCTOR_REPORT_CATEGORIES, DoctorReportCategory, reportDoctor } from "@/lib/doctorReports";
import { fileToScaledDataUrl } from "@/lib/image";
import { ApiError } from "@/lib/api";

export default function ReportDoctorModal({
  doctorId,
  doctorName,
  onClose,
}: {
  doctorId: string;
  doctorName: string;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<DoctorReportCategory>(DOCTOR_REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [compressingPhoto, setCompressingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError(null);
    setCompressingPhoto(true);
    try {
      const dataUrl = await fileToScaledDataUrl(file);
      setPhotoUrl(dataUrl);
    } catch {
      setPhotoError("Could not load that image. Please try another.");
    } finally {
      setCompressingPhoto(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await reportDoctor({
        doctorId,
        category,
        description: description.trim(),
        photoUrl: photoUrl ?? undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-secondary text-5xl">
                check_circle
              </span>
              <p className="font-bold text-on-surface">Report submitted</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Thank you for letting us know. Our admin team will review this report.
              </p>
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
        <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">Report {doctorName}</h3>
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
            <p className="font-body-md text-body-md text-on-surface-variant">
              If something went wrong during your visit, let us know. Our admin team reviews every
              report.
            </p>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Reason</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DoctorReportCategory)}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              >
                {DOCTOR_REPORT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">What happened?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe what happened during your visit..."
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">
                Photo evidence (optional)
              </label>
              {photoError && (
                <p className="font-label-sm text-label-sm text-error">{photoError}</p>
              )}
              {photoUrl ? (
                <div className="relative w-full max-w-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Report evidence"
                    className="w-full rounded-lg border border-outline-variant/30 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    aria-label="Remove photo"
                    className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1 shadow-sm hover:opacity-90"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressingPhoto}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {compressingPhoto ? "progress_activity" : "add_a_photo"}
                  </span>
                  <span className="font-label-sm text-label-sm">
                    {compressingPhoto ? "Processing..." : "Attach a photo"}
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelected}
                className="hidden"
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
                disabled={saving || !description.trim()}
                className="px-6 py-2 bg-error text-on-error rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
              >
                {saving ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
