import { api } from "@/lib/api";

export type DepartmentAvailability = "open" | "busy" | "closed";
export type DepartmentTone = "primary" | "secondary" | "tertiary" | "error";

export interface Department {
  slug: string;
  name: string;
  icon: string;
  tone: DepartmentTone;
  description: string;
  availability: DepartmentAvailability;
  meta: string;
}

export interface DepartmentRecord extends Department {
  _id: string;
}

export async function getDepartments(): Promise<DepartmentRecord[]> {
  const { departments } = await api.get<{ departments: DepartmentRecord[] }>("/departments");
  return departments;
}

export async function getDepartment(slug: string | null): Promise<Department | undefined> {
  if (!slug) return undefined;
  const departments = await getDepartments();
  return departments.find((d) => d.slug === slug);
}

export type CreateDepartmentInput = Department;

export async function createDepartment(input: CreateDepartmentInput): Promise<DepartmentRecord> {
  const { department } = await api.post<{ department: DepartmentRecord }>("/departments", input);
  return department;
}

export async function updateDepartment(
  id: string,
  patch: Partial<CreateDepartmentInput>
): Promise<DepartmentRecord> {
  const { department } = await api.put<{ department: DepartmentRecord }>(
    `/departments/${id}`,
    patch
  );
  return department;
}

export async function deleteDepartment(id: string): Promise<void> {
  await api.delete(`/departments/${id}`);
}
