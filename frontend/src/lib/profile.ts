import { api } from "@/lib/api";
import { SessionUser, getSession, saveSession } from "@/lib/auth";
import { ProfileData } from "@/app/patient/profile/_components/types";

export function sessionUserToProfile(user: SessionUser): ProfileData {
  return {
    fullName: user.name,
    email: user.email,
    phone: user.phone ?? "",
    address: user.address ?? "",
    bloodType: user.bloodType ?? "",
    allergies: user.allergies ?? "",
    chronicConditions: user.chronicConditions ?? "",
  };
}

export async function updateProfile(profile: ProfileData): Promise<ProfileData> {
  const { user } = await api.patch<{ user: SessionUser }>("/auth/me", {
    name: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    bloodType: profile.bloodType,
    allergies: profile.allergies,
    chronicConditions: profile.chronicConditions,
  });

  const session = getSession();
  if (session) saveSession({ ...session, user });

  return sessionUserToProfile(user);
}
