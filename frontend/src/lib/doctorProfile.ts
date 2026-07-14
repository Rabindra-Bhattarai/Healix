import { api } from "@/lib/api";
import { Doctor } from "@/lib/doctors";

export interface DoctorProfilePatch {
  specialty?: string;
  description?: string;
  tags?: string[];
  experienceYears?: number;
  location?: string;
}

export async function updateMyDoctorProfile(patch: DoctorProfilePatch): Promise<Doctor> {
  const { doctor } = await api.patch<{ doctor: Doctor }>("/doctors/me", patch);
  return doctor;
}
