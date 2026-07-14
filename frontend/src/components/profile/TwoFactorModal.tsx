"use client";

import { FormEvent, useState } from "react";
import Portal from "@/components/ui/Portal";
import { enableTwoFactor, verifyTwoFactorSetup, disableTwoFactor } from "@/lib/security";
import { ApiError } from "@/lib/api";

export default function TwoFactorModal({
  mode,
  onClose,
  onChanged,
}: {
  mode: "enable" | "disable";
  onClose: () => void;
  onChanged: (enabled: boolean) => void;
}) {
  const [step, setStep] = useState<"start" | "verify">("start");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    setError(null);
    setLoading(true);
    try {
      await enableTwoFactor();
      setStep("verify");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyTwoFactorSetup(otp);
      onChanged(true);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await disableTwoFactor(password);
      onChanged(false);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-background/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">
              {mode === "enable" ? "Enable Two-Factor Authentication" : "Disable Two-Factor Authentication"}
            </h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {error && (
            <p className="mx-6 mt-4 font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {mode === "disable" ? (
            <form onSubmit={handleDisable} className="p-6 space-y-4">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your password to turn off two-factor authentication.
              </p>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  disabled={loading}
                  className="px-6 py-2 bg-error text-on-error rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
                >
                  {loading ? "Disabling..." : "Disable"}
                </button>
              </div>
            </form>
          ) : step === "start" ? (
            <div className="p-6 space-y-4">
              <p className="font-body-md text-body-md text-on-surface-variant">
                We&apos;ll email a 6-digit code to your account email to confirm you can receive
                two-factor codes.
              </p>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Code"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="p-6 space-y-4">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter the 6-digit code we emailed you.
              </p>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white tracking-[0.3em] text-center"
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
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
}
