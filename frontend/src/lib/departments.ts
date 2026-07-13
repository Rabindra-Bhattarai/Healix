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

export async function getDepartments(): Promise<Department[]> {
  const { departments } = await api.get<{ departments: Department[] }>("/departments");
  return departments;
}

export async function getDepartment(slug: string | null): Promise<Department | undefined> {
  if (!slug) return undefined;
  const departments = await getDepartments();
  return departments.find((d) => d.slug === slug);
}
