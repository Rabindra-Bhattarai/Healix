"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthTopNav from "@/components/auth/AuthTopNav";
import AuthFooter from "@/components/auth/AuthFooter";

type Gender = "male" | "female" | "other";

const TRUST_BADGES = [
  { icon: "shield", label: "HIPAA Compliant" },
  { icon: "encrypted", label: "Encrypted Storage" },
  { icon: "support_agent", label: "24/7 Priority Support" },
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Too weak", percent: 10, color: "bg-error", text: "text-error" },
    { label: "Weak", percent: 35, color: "bg-error", text: "text-error" },
    { label: "Fair", percent: 60, color: "bg-tertiary", text: "text-tertiary" },
    { label: "Strong", percent: 85, color: "bg-secondary", text: "text-secondary" },
    { label: "Very strong", percent: 100, color: "bg-secondary", text: "text-secondary" },
  ];
  return password.length === 0 ? null : levels[score];
}

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  function handleStep1Submit(e: FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  function handleVerifySubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/login");
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthTopNav
        crumb="Registration"
        step={
          step === 1
            ? { current: 1, total: 2, label: "Personal Information" }
            : { current: 2, total: 2, label: "Verify Your Identity" }
        }
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-24 pb-12">
        <div className="flex flex-col gap-6 items-center max-w-[640px] w-full">
          {step === 1 ? (
            <>
              <div className="flex flex-col gap-2 items-center text-center">
                <h1 className="font-h1 text-h1 text-on-surface">
                  Create your professional account
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Join the next generation of healthcare administration.
                </p>
              </div>

              <form
                onSubmit={handleStep1Submit}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0px_4px_20px_-2px_rgba(136,135,128,0.1)] px-5 sm:px-8 pt-8 pb-10 flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" name="fullName" placeholder="Dr. Julian Moore" required />
                  <Input
                    label="Phone Number"
                    name="phone"
                    prefix="+977"
                    placeholder="9841000000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="julian.moore@healix.io"
                    required
                  />
                  <Input label="Date of Birth" name="dob" type="date" required />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Gender
                  </span>
                  <div className="flex gap-2">
                    {(["male", "female", "other"] as Gender[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setGender(option)}
                        className={`flex-1 h-10 rounded-full border font-body-md text-body-md capitalize transition-colors ${
                          gender === option
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-outline-variant text-on-surface"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2 border-t border-outline-variant/10">
                  <div className="flex flex-col gap-2">
                    <Input
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="material-symbols-outlined text-[18px] text-on-surface-variant"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? "visibility_off" : "visibility"}
                        </button>
                      }
                    />
                    {strength && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-surface-container-highest overflow-hidden">
                          <div
                            className={`h-full ${strength.color}`}
                            style={{ width: `${strength.percent}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono-label text-mono-label uppercase ${strength.text}`}
                        >
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                </div>

                <div className="flex flex-col gap-4 items-center pt-2">
                  <Button type="submit" className="w-full">
                    Continue
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Button>
                  <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
                    By clicking continue, you agree to our{" "}
                    <a href="#" className="text-primary font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary font-medium">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {TRUST_BADGES.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      {badge.icon}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2 items-center text-center">
                <h1 className="font-h1 text-h1 text-on-surface">Verify your identity</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Enter the 6-digit code we sent to your phone number.
                </p>
              </div>

              <form
                onSubmit={handleVerifySubmit}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0px_4px_20px_-2px_rgba(136,135,128,0.1)] px-5 sm:px-8 pt-8 pb-10 flex flex-col gap-6 items-center"
              >
                <div className="flex gap-2 sm:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-h3 font-h3 rounded-lg border border-outline-variant focus:border-primary outline-none"
                    />
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Didn&apos;t receive a code?{" "}
                  <button type="button" className="text-primary font-semibold">
                    Resend
                  </button>
                </p>
                <div className="flex gap-3 w-full">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Verify &amp; Continue
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
