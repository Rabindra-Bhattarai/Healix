"use client";

import { FormEvent, useState } from "react";
import Portal from "@/components/ui/Portal";
import { changePassword } from "@/lib/security";
import { ApiError } from "@/lib/api";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-background/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">Change Password</h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {success ? (
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-secondary text-5xl">
                check_circle
              </span>
              <p className="font-bold text-on-surface">Password changed</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
                  {saving ? "Saving..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
}
