"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { api, ApiError } from "@/lib/api";
import { saveSession, roleHomePath, Session } from "@/lib/auth";
import { loginWithGoogle, loginWithFacebook } from "@/lib/sso";
import { loadFacebookSdk, facebookLogin } from "@/lib/facebookSdk";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "";

const FEATURES = [
  {
    icon: "calendar_month",
    title: "Instant Booking",
    copy: "Seamless scheduling for patients and practitioners.",
  },
  {
    icon: "reorder",
    title: "Real-time Queue",
    copy: "Live visibility into patient flow and wait times.",
  },
  {
    icon: "lock",
    title: "Secure Health Vault",
    copy: "Military-grade encryption for all medical records.",
  },
];

type LoginResponse = Session | { requiresTwoFactor: true; email: string };

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const registeredSuccess = searchParams.get("registered") === "success";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.post<LoginResponse>("/auth/login", { email, password });
      if ("requiresTwoFactor" in result) {
        setAwaitingTwoFactor(true);
        return;
      }
      saveSession(result);
      router.push(roleHomePath(result.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyTwoFactor(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.post<Session>("/auth/login/verify-2fa", { email, otp });
      saveSession(result);
      router.push(roleHomePath(result.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) return;
    setError(null);
    setSsoLoading(true);
    try {
      const { token, user } = await loginWithGoogle(response.credential);
      saveSession({ token, user });
      router.push(roleHomePath(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Google sign-in failed. Please try again.");
    } finally {
      setSsoLoading(false);
    }
  }

  async function handleFacebookClick() {
    if (!FACEBOOK_APP_ID) return;
    setError(null);
    setSsoLoading(true);
    try {
      await loadFacebookSdk(FACEBOOK_APP_ID);
      const accessToken = await facebookLogin();
      const { token, user } = await loginWithFacebook(accessToken);
      saveSession({ token, user });
      router.push(roleHomePath(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Facebook sign-in failed. Please try again.");
    } finally {
      setSsoLoading(false);
    }
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen relative">
      <main className="min-h-screen flex flex-col md:flex-row items-center justify-center px-grid_margin py-grid_margin max-w-7xl mx-auto">
        {/* Left Column: Branding & Features */}
        <div className="w-full md:w-1/2 flex flex-col space-y-stack_gap_lg md:pr-12 mb-12 md:mb-0">
          <div className="flex items-center space-x-stack_gap_sm">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-on-primary">medical_services</span>
            </div>
            <span className="font-h2 text-h2 font-bold text-primary">Healix</span>
          </div>

          <div className="space-y-stack_gap_sm">
            <h1 className="font-h1 text-h1 text-on-background tracking-tight">
              Healthcare, simplified
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              The clinical OS designed for the next generation of healthcare providers.
              Precision management in a quiet, authoritative interface.
            </p>
          </div>

          <div className="space-y-stack_gap_md pt-stack_gap_lg border-t-[0.5px] border-outline-variant/30">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-stack_gap_md group">
                <div className="p-2 bg-surface-container rounded-lg group-hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-h3 text-h3 text-on-surface">{feature.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {feature.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-md bg-surface-container-lowest border-[0.5px] border-outline-variant/30 rounded-xl shadow-[0_4px_20px_-2px_rgba(136,135,128,0.1)] p-stack_gap_lg flex flex-col space-y-stack_gap_lg">
            <div className="space-y-stack_gap_sm">
              <h2 className="font-h2 text-h2 text-on-background">Sign In</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Welcome back. Please enter your credentials.
              </p>
            </div>

            {awaitingTwoFactor ? (
              <form onSubmit={handleVerifyTwoFactor} className="space-y-stack_gap_md">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  We&apos;ve emailed a 6-digit code to{" "}
                  <span className="font-semibold text-on-surface">{email}</span>. Enter it below
                  to finish signing in.
                </p>
                {error && (
                  <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <div className="space-y-1">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="otp"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="123456"
                    className="w-full h-10 px-3 bg-surface-container-lowest border-[0.5px] border-outline-variant/50 rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none tracking-[0.3em] text-center"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary text-on-primary font-body-md font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAwaitingTwoFactor(false);
                    setOtp("");
                    setError(null);
                  }}
                  className="w-full text-center font-label-sm text-label-sm text-on-surface-variant hover:underline"
                >
                  Back to sign in
                </button>
              </form>
            ) : (
              <>
            <form onSubmit={handleSubmit} className="space-y-stack_gap_md">
              {resetSuccess && !error && (
                <p className="font-label-sm text-label-sm text-secondary bg-secondary-container/50 rounded-lg px-3 py-2">
                  Password reset successful. Please sign in with your new password.
                </p>
              )}
              {registeredSuccess && !error && (
                <p className="font-label-sm text-label-sm text-secondary bg-secondary-container/50 rounded-lg px-3 py-2">
                  Account created successfully. Please sign in.
                </p>
              )}
              {error && (
                <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="id">
                  Email Address
                </label>
                <input
                  id="id"
                  name="id"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@clinic.com"
                  className="w-full h-10 px-3 bg-surface-container-lowest border-[0.5px] border-outline-variant/50 rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-label-sm text-label-sm text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-10 pl-3 pr-10 bg-surface-container-lowest border-[0.5px] border-outline-variant/50 rounded-lg font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-primary text-on-primary font-body-md font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-[0.5px] border-outline-variant/30" />
              <span className="flex-shrink mx-4 font-mono-label text-mono-label text-on-surface-variant">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t-[0.5px] border-outline-variant/30" />
            </div>

            <div className="grid grid-cols-2 gap-stack_gap_md">
              {GOOGLE_CLIENT_ID ? (
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en">
                  <div className="[&>div]:!w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError("Google sign-in failed. Please try again.")}
                      theme="outline"
                      shape="rectangular"
                      size="large"
                      width="180"
                    />
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <button
                  disabled
                  title="Google sign-in is not configured yet"
                  className="flex items-center justify-center h-10 border-[0.5px] border-outline-variant/50 rounded-lg text-on-surface-variant/40 cursor-not-allowed"
                >
                  <span className="font-body-md">Google</span>
                </button>
              )}

              <button
                onClick={handleFacebookClick}
                disabled={!FACEBOOK_APP_ID || ssoLoading}
                title={FACEBOOK_APP_ID ? undefined : "Facebook sign-in is not configured yet"}
                className="flex items-center justify-center h-10 border-[0.5px] border-outline-variant/50 rounded-lg hover:bg-surface-container transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-body-md text-on-surface">Facebook</span>
              </button>
            </div>

            <p className="text-center font-body-md text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Create account
              </Link>
            </p>
              </>
            )}
          </div>
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] bg-secondary-container/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
