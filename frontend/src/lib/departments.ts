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

export const DEPARTMENTS: Department[] = [
  {
    slug: "cardiology",
    name: "Cardiology",
    icon: "cardiology",
    tone: "primary",
    description:
      "Advanced heart health monitoring, non-invasive diagnostics, and expert surgical interventions for cardiovascular care.",
    availability: "open",
    meta: "Estimated wait: 20 mins",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    icon: "pediatrics",
    tone: "tertiary",
    description:
      "Compassionate, specialized care for infants, children, and adolescents, including wellness checks and immunization.",
    availability: "busy",
    meta: "Estimated wait: 45 mins",
  },
  {
    slug: "neurology",
    name: "Neurology",
    icon: "neurology",
    tone: "secondary",
    description:
      "Comprehensive diagnosis and treatment of brain, spinal cord, and peripheral nerve disorders using the latest technology.",
    availability: "open",
    meta: "Estimated wait: 15 mins",
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    icon: "dermatology",
    tone: "primary",
    description:
      "Expert skin health management including therapeutic treatments, surgical dermatology, and preventative skin screenings.",
    availability: "closed",
    meta: "Opens at 8:00 AM",
  },
];

export function getDepartment(slug: string | null): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug === slug);
}

const SYMPTOM_KEYWORDS: { slug: string; keywords: string[] }[] = [
  {
    slug: "cardiology",
    keywords: ["heart", "chest pain", "chest", "palpitation", "cardiac", "blood pressure", "short of breath", "breathless"],
  },
  {
    slug: "pediatrics",
    keywords: ["child", "kid", "infant", "baby", "toddler", "vaccination", "vaccine"],
  },
  {
    slug: "neurology",
    keywords: ["headache", "migraine", "dizzy", "dizziness", "seizure", "nerve", "numbness", "tingling"],
  },
  {
    slug: "dermatology",
    keywords: ["skin", "rash", "acne", "itch", "itchy", "eczema", "mole"],
  },
];

export function matchDepartmentFromSymptoms(text: string): Department | undefined {
  const lower = text.toLowerCase();
  const match = SYMPTOM_KEYWORDS.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  return match ? getDepartment(match.slug) : undefined;
}
