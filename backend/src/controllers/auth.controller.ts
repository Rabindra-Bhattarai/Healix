import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import Doctor from "../models/Doctor";
import PendingRegistration from "../models/PendingRegistration";
import { signToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { generateOtp } from "../utils/otp";
import { sendOtpEmail, sendPasswordResetEmail, sendTwoFactorEmail } from "../utils/email";

const OTP_TTL_MINUTES = 10;

function toPublicUser(user: InstanceType<typeof User>) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bloodType: user.bloodType,
    allergies: user.allergies,
    chronicConditions: user.chronicConditions,
    address: user.address,
    dob: user.dob,
    gender: user.gender,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
  };
}

async function issueSession(user: InstanceType<typeof User>) {
  return { token: signToken({ id: user._id.toString(), role: user.role }), user: toPublicUser(user) };
}

// --- Email + password registration, gated behind a real emailed OTP ---

export const startRegistration = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await PendingRegistration.findOneAndUpdate(
    { email: normalizedEmail },
    { name, email: normalizedEmail, phone, passwordHash, otpHash, expiresAt },
    { upsert: true }
  );

  await sendOtpEmail(normalizedEmail, otp);
  res.status(200).json({ message: "Verification code sent" });
});

export const resendRegistrationOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ message: "email is required" });

  const normalizedEmail = email.toLowerCase();
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });
  if (!pending) {
    return res.status(404).json({ message: "No pending registration found for this email" });
  }

  const otp = generateOtp();
  pending.otpHash = await bcrypt.hash(otp, 10);
  pending.expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await pending.save();

  await sendOtpEmail(normalizedEmail, otp);
  res.status(200).json({ message: "Verification code resent" });
});

export const verifyRegistration = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body ?? {};
  if (!email || !otp) return res.status(400).json({ message: "email and otp are required" });

  const normalizedEmail = email.toLowerCase();
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });
  if (!pending) {
    return res.status(400).json({ message: "No pending registration found. Please start again." });
  }

  if (pending.expiresAt.getTime() < Date.now()) {
    await pending.deleteOne();
    return res.status(400).json({ message: "Code expired. Please request a new one." });
  }

  const match = await bcrypt.compare(otp, pending.otpHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid verification code" });
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    phone: pending.phone,
    passwordHash: pending.passwordHash,
    role: "patient",
  });
  await pending.deleteOne();

  res.status(201).json({ message: "Account created", email: user.email });
});

// --- Password login (with an email-OTP 2FA step for accounts that enabled it) ---

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.role === "doctor") {
    const doctor = await Doctor.findOne({ user: user._id });
    if (doctor?.isBlocked) {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact the hospital administration.",
      });
    }
  }

  if (user.twoFactorEnabled) {
    const otp = generateOtp();
    user.twoFactorLoginOtpHash = await bcrypt.hash(otp, 10);
    user.twoFactorLoginOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await user.save();
    await sendTwoFactorEmail(user.email, otp);
    return res.json({ requiresTwoFactor: true, email: user.email });
  }

  res.json(await issueSession(user));
});

export const verifyTwoFactorLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body ?? {};
  if (!email || !otp) return res.status(400).json({ message: "email and otp are required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user?.twoFactorLoginOtpHash || !user.twoFactorLoginOtpExpiresAt) {
    return res.status(400).json({ message: "No sign-in code was requested for this email." });
  }

  if (user.twoFactorLoginOtpExpiresAt.getTime() < Date.now()) {
    user.twoFactorLoginOtpHash = undefined;
    user.twoFactorLoginOtpExpiresAt = undefined;
    await user.save();
    return res.status(400).json({ message: "Code expired. Please sign in again." });
  }

  const match = await bcrypt.compare(otp, user.twoFactorLoginOtpHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid verification code" });
  }

  user.twoFactorLoginOtpHash = undefined;
  user.twoFactorLoginOtpExpiresAt = undefined;
  await user.save();

  res.json(await issueSession(user));
});

// --- Forgot / reset password (same OTP-via-email pattern as registration) ---

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ message: "email is required" });

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to check which emails are registered.
  if (user) {
    const otp = generateOtp();
    user.resetOtpHash = await bcrypt.hash(otp, 10);
    user.resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(normalizedEmail, otp);
  }

  res.status(200).json({ message: "If an account exists for that email, a reset code has been sent." });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body ?? {};
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "email, otp, and newPassword are required" });
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user?.resetOtpHash || !user.resetOtpExpiresAt) {
    return res.status(400).json({ message: "No password reset was requested for this email." });
  }

  if (user.resetOtpExpiresAt.getTime() < Date.now()) {
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();
    return res.status(400).json({ message: "Code expired. Please request a new one." });
  }

  const match = await bcrypt.compare(otp, user.resetOtpHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid verification code" });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetOtpHash = undefined;
  user.resetOtpExpiresAt = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});

// --- Google / Facebook SSO ---
// Both find-or-create a "patient" User by verified email, then issue the same
// session shape as password login. New SSO accounts get an unusable random
// password hash since they never log in with a password.

async function findOrCreateSsoUser(name: string, email: string) {
  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });
  if (user) return user;

  const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
  user = await User.create({ name, email: normalizedEmail, passwordHash, role: "patient" });
  return user;
}

const googleClient = new OAuth2Client();

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body ?? {};
  if (!credential) return res.status(400).json({ message: "credential is required" });
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: "Google sign-in is not configured on the server" });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: "Invalid Google credential" });
  }

  if (!payload?.email || !payload.email_verified) {
    return res.status(401).json({ message: "Google account has no verified email" });
  }

  const user = await findOrCreateSsoUser(payload.name ?? payload.email, payload.email);
  res.json(await issueSession(user));
});

export const facebookAuth = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = req.body ?? {};
  if (!accessToken) return res.status(400).json({ message: "accessToken is required" });
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.status(500).json({ message: "Facebook sign-in is not configured on the server" });
  }

  const debugRes = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
  );
  const debugBody = (await debugRes.json()) as {
    data?: { is_valid?: boolean; app_id?: string; scopes?: string[] };
  };
  console.log("[facebookAuth] debug_token scopes:", debugBody?.data?.scopes);
  const isValid = debugBody?.data?.is_valid && debugBody?.data?.app_id === process.env.FACEBOOK_APP_ID;
  if (!isValid) {
    return res.status(401).json({ message: "Invalid Facebook access token" });
  }

  const meRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
  );
  const me = (await meRes.json()) as { id?: string; name?: string; email?: string };
  console.log("[facebookAuth] Graph API /me response:", me);
  if (!me?.email) {
    return res.status(401).json({ message: "Facebook account has no accessible email" });
  }

  const user = await findOrCreateSsoUser(me.name ?? me.email, me.email);
  res.json(await issueSession(user));
});

// --- Current user ---

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: toPublicUser(user) });
});

const UPDATABLE_FIELDS = [
  "name",
  "phone",
  "address",
  "bloodType",
  "allergies",
  "chronicConditions",
  "dob",
  "gender",
  "avatarUrl",
] as const;

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const updates: Record<string, unknown> = {};
  for (const field of UPDATABLE_FIELDS) {
    if (req.body?.[field] !== undefined) updates[field] = req.body[field];
  }

  if (req.body?.email !== undefined) {
    const email = req.body.email.toLowerCase();
    const existing = await User.findOne({ email, _id: { $ne: req.user!.id } });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });
    updates.email = email;
  }

  const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: toPublicUser(user) });
});

// --- Change password (requires knowing the current password, unlike forgot/reset) ---

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "currentPassword and newPassword are required" });
  }

  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
});

// --- Two-factor authentication setup (email OTP) ---

export const enableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.twoFactorEnabled) {
    return res.status(400).json({ message: "Two-factor authentication is already enabled" });
  }

  const otp = generateOtp();
  user.twoFactorSetupOtpHash = await bcrypt.hash(otp, 10);
  user.twoFactorSetupOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await user.save();

  await sendTwoFactorEmail(user.email, otp);
  res.json({ message: "Verification code sent" });
});

export const verifyTwoFactorSetup = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body ?? {};
  if (!otp) return res.status(400).json({ message: "otp is required" });

  const user = await User.findById(req.user!.id);
  if (!user?.twoFactorSetupOtpHash || !user.twoFactorSetupOtpExpiresAt) {
    return res.status(400).json({ message: "No two-factor setup in progress." });
  }

  if (user.twoFactorSetupOtpExpiresAt.getTime() < Date.now()) {
    user.twoFactorSetupOtpHash = undefined;
    user.twoFactorSetupOtpExpiresAt = undefined;
    await user.save();
    return res.status(400).json({ message: "Code expired. Please request a new one." });
  }

  const match = await bcrypt.compare(otp, user.twoFactorSetupOtpHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid verification code" });
  }

  user.twoFactorEnabled = true;
  user.twoFactorSetupOtpHash = undefined;
  user.twoFactorSetupOtpExpiresAt = undefined;
  await user.save();

  res.json({ user: toPublicUser(user) });
});

export const disableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body ?? {};
  if (!password) return res.status(400).json({ message: "password is required" });

  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  user.twoFactorEnabled = false;
  user.twoFactorSetupOtpHash = undefined;
  user.twoFactorSetupOtpExpiresAt = undefined;
  await user.save();

  res.json({ user: toPublicUser(user) });
});
