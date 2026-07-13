"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");

  async function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("reset");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendState("sending");
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setResendState("sent");
      setTimeout(() => setResendState("idle"), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code.");
      setResendState("idle");
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp: otp.join(""), newPassword });
      router.push("/login?reset=success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen relative">
      <main className="min-h-screen flex items-center justify-center px-grid_margin py-grid_margin">
        <div className="w-full max-w-md bg-surface-container-lowest border-[0.5px] border-outline-variant/30 rounded-xl shadow-[0_4px_20px_-2px_rgba(136,135,128,0.1)] p-stack_gap_lg flex flex-col space-y-stack_gap_lg">
          <div className="flex items-center space-x-stack_gap_sm">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-on-primary">medical_services</span>
            </div>
            <span className="font-h2 text-h2 font-bold text-primary">Healix</span>
          </div>

          {step === "email" ? (
            <>
              <div className="space-y-stack_gap_sm">
                <h2 className="font-h2 text-h2 text-on-background">Forgot password?</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Enter your account email and we&apos;ll send you a reset code.
                </p>
              </div>

              <form onSubmit={handleRequestCode} className="space-y-stack_gap_md">
                {error && (
                  <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@clinic.com"
                    className="w-full h-10 px-3 bg-surface-container-lowest border-[0.5px] border-outline-variant/50 rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary text-on-primary font-body-md font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-stack_gap_sm">
                <h2 className="font-h2 text-h2 text-on-background">Reset your password</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Enter the 6-digit code we emailed to {email} and choose a new password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-stack_gap_md">
                {error && (
                  <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`reset-otp-${i}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-12 text-center text-h3 font-h3 rounded-lg border border-outline-variant focus:border-primary outline-none"
                    />
                  ))}
                </div>
                <p className="text-center font-body-md text-body-md text-on-surface-variant">
                  Didn&apos;t receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendState === "sending"}
                    className="text-primary font-semibold disabled:opacity-60"
                  >
                    {resendState === "sent" ? "Sent!" : resendState === "sending" ? "Sending..." : "Resend"}
                  </button>
                </p>

                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-10 px-3 bg-surface-container-lowest border-[0.5px] border-outline-variant/50 rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-10 px-3 bg-surface-container-lowest border-[0.5px] border-outline-variant/50 rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary text-on-primary font-body-md font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <p className="text-center font-body-md text-on-surface-variant">
            Remembered your password?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] bg-secondary-container/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
