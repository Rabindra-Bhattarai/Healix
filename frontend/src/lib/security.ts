import { api } from "@/lib/api";
import { SessionUser, getSession, saveSession } from "@/lib/auth";

function updateSessionUser(user: SessionUser) {
  const session = getSession();
  if (session) saveSession({ ...session, user });
}

export async function uploadAvatar(dataUrl: string): Promise<SessionUser> {
  const { user } = await api.patch<{ user: SessionUser }>("/auth/me", { avatarUrl: dataUrl });
  updateSessionUser(user);
  return user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post("/auth/change-password", { currentPassword, newPassword });
}

export async function enableTwoFactor(): Promise<void> {
  await api.post("/auth/2fa/enable");
}

export async function verifyTwoFactorSetup(otp: string): Promise<SessionUser> {
  const { user } = await api.post<{ user: SessionUser }>("/auth/2fa/verify-setup", { otp });
  updateSessionUser(user);
  return user;
}

export async function disableTwoFactor(password: string): Promise<SessionUser> {
  const { user } = await api.post<{ user: SessionUser }>("/auth/2fa/disable", { password });
  updateSessionUser(user);
  return user;
}
