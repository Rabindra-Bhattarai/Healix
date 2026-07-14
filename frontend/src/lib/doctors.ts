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

export interface DoctorRecord extends Doctor {
  _id: string;
  user: string;
  department?: { _id: string; name: string; slug: string };
  email?: string;
  phone?: string;
  isBlocked?: boolean;
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

export async function getAllDoctors(): Promise<DoctorRecord[]> {
  const { doctors } = await api.get<{ doctors: DoctorRecord[] }>("/doctors");
  return doctors;
}

export interface CreateDoctorInput {
  name: string;
  email: string;
  password: string;
  departmentSlug: string;
  specialty: string;
  phone?: string;
  experienceYears?: number;
  location?: string;
  description?: string;
  tags?: string[];
}

export async function createDoctorAccount(input: CreateDoctorInput): Promise<DoctorRecord> {
  const { doctor } = await api.post<{ doctor: DoctorRecord }>("/doctors", input);
  return doctor;
}

export async function updateDoctorRecord(
  id: string,
  patch: Partial<CreateDoctorInput>
): Promise<DoctorRecord> {
  const { doctor } = await api.put<{ doctor: DoctorRecord }>(`/doctors/${id}`, patch);
  return doctor;
}

export async function deleteDoctorRecord(id: string): Promise<void> {
  await api.delete(`/doctors/${id}`);
}

export async function setDoctorBlocked(id: string, isBlocked: boolean): Promise<DoctorRecord> {
  const { doctor } = await api.put<{ doctor: DoctorRecord }>(`/doctors/${id}`, { isBlocked });
  return doctor;
}
