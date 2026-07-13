import { api } from "@/lib/api";

export interface Doctor {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  location: string;
  description: string;
  tags?: string[];
}

interface DoctorRecord extends Doctor {
  _id: string;
}

export async function getDoctorsByDepartment(departmentSlug: string): Promise<Doctor[]> {
  const { doctors } = await api.get<{ doctors: DoctorRecord[] }>(
    `/doctors?department=${departmentSlug}`
  );
  return doctors;
}

export async function findDoctorBySlug(slug: string | null): Promise<Doctor | undefined> {
  if (!slug) return undefined;
  const { doctors } = await api.get<{ doctors: DoctorRecord[] }>("/doctors");
  return doctors.find((d) => d.slug === slug);
}

export async function findDoctorIdBySlug(slug: string | null): Promise<string | undefined> {
  if (!slug) return undefined;
  const { doctors } = await api.get<{ doctors: DoctorRecord[] }>("/doctors");
  return doctors.find((d) => d.slug === slug)?._id;
}
