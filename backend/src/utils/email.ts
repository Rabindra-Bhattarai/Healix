import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

async function sendEmail(to: string, subject: string, html: string, devLabel: string) {
  const resend = getResend();

  if (!resend) {
    // Dev fallback: no RESEND_API_KEY configured yet, so just log it instead of
    // failing the request. Remove once a real key is set in backend/.env.
    console.log(`\n[DEV EMAIL] ${devLabel} for ${to}\n`);
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Healix <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error(`[email] Resend failed to send to ${to}:`, error);
    // Fall back to logging so the flow is still testable even if delivery failed
    // (e.g. sandbox mode only allows sending to the Resend account's own address).
    console.log(`\n[DEV EMAIL FALLBACK] ${devLabel} for ${to}\n`);
  }
}

export async function sendOtpEmail(to: string, otp: string) {
  await sendEmail(
    to,
    "Your Healix verification code",
    `<p>Your verification code is:</p><h2 style="letter-spacing:4px">${otp}</h2><p>This code expires in 10 minutes.</p>`,
    `Registration OTP ${otp}`
  );
}

export async function sendPasswordResetEmail(to: string, otp: string) {
  await sendEmail(
    to,
    "Reset your Healix password",
    `<p>Someone requested a password reset for this account. Your reset code is:</p><h2 style="letter-spacing:4px">${otp}</h2><p>This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>`,
    `Password reset OTP ${otp}`
  );
}

export async function sendTwoFactorEmail(to: string, otp: string) {
  await sendEmail(
    to,
    "Your Healix sign-in code",
    `<p>Your two-factor authentication code is:</p><h2 style="letter-spacing:4px">${otp}</h2><p>This code expires in 10 minutes. If you didn't try to sign in, you can safely ignore this email.</p>`,
    `Two-factor OTP ${otp}`
  );
}
