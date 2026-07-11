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

export const DOCTORS_BY_DEPARTMENT: Record<string, Doctor[]> = {
  cardiology: [
    {
      slug: "sarah-jenkins",
      name: "Dr. Sarah Jenkins, MD",
      specialty: "Senior Cardiologist",
      rating: 4.9,
      reviewCount: 124,
      experienceYears: 15,
      location: "St. Mary's Medical",
      description:
        "Specialized in interventional cardiology and non-invasive diagnostics, recognized for excellence in patient recovery and long-term heart health management.",
      tags: ["Heart Failure", "Angioplasty"],
    },
    {
      slug: "michael-chen",
      name: "Dr. Michael Chen",
      specialty: "Interventional Cardiology",
      rating: 4.8,
      reviewCount: 98,
      experienceYears: 12,
      location: "St. Mary's Medical",
      description:
        "Expert in catheter-based treatment of cardiovascular disease with a focus on patient-centered outcomes.",
    },
    {
      slug: "elena-rodriguez",
      name: "Dr. Elena Rodriguez",
      specialty: "Pediatric Cardiology",
      rating: 4.7,
      reviewCount: 156,
      experienceYears: 8,
      location: "St. Mary's Medical",
      description:
        "Passionate about diagnosing and treating congenital and acquired heart conditions in children and adolescents.",
    },
  ],
  pediatrics: [
    {
      slug: "maya-fernandes",
      name: "Dr. Maya Fernandes, MD",
      specialty: "Senior General Pediatrics",
      rating: 4.8,
      reviewCount: 143,
      experienceYears: 10,
      location: "St. Mary's Medical",
      description:
        "Dedicated to comprehensive wellness checks, immunization schedules, and early childhood development for infants through adolescents.",
      tags: ["Wellness Checks", "Immunization"],
    },
    {
      slug: "owen-brooks",
      name: "Dr. Owen Brooks",
      specialty: "Neonatology",
      rating: 4.9,
      reviewCount: 98,
      experienceYears: 14,
      location: "St. Mary's Medical",
      description: "Specialized care for newborns, including premature and critically ill infants.",
    },
    {
      slug: "priya-nair",
      name: "Dr. Priya Nair",
      specialty: "Adolescent Medicine",
      rating: 4.5,
      reviewCount: 52,
      experienceYears: 7,
      location: "St. Mary's Medical",
      description: "Focused on the physical and behavioral health needs of teenagers.",
    },
  ],
  neurology: [
    {
      slug: "victor-adeyemi",
      name: "Dr. Victor Adeyemi, MD",
      specialty: "Senior Clinical Neurologist",
      rating: 4.8,
      reviewCount: 132,
      experienceYears: 14,
      location: "St. Mary's Medical",
      description:
        "Specialized in the diagnosis and treatment of brain, spinal cord, and peripheral nerve disorders using the latest neuroimaging technology.",
      tags: ["Migraine Care", "Seizure Disorders"],
    },
    {
      slug: "lena-schmidt",
      name: "Dr. Lena Schmidt",
      specialty: "Neurophysiology",
      rating: 4.6,
      reviewCount: 74,
      experienceYears: 8,
      location: "St. Mary's Medical",
      description: "Expert in nerve conduction studies and electromyography for complex neurological cases.",
    },
    {
      slug: "daniel-osei",
      name: "Dr. Daniel Osei",
      specialty: "Stroke & Vascular Neurology",
      rating: 4.7,
      reviewCount: 61,
      experienceYears: 11,
      location: "St. Mary's Medical",
      description: "Focused on rapid diagnosis and treatment of stroke and cerebrovascular conditions.",
    },
  ],
  dermatology: [
    {
      slug: "grace-whitfield",
      name: "Dr. Grace Whitfield, MD",
      specialty: "Senior Clinical Dermatologist",
      rating: 4.9,
      reviewCount: 188,
      experienceYears: 13,
      location: "St. Mary's Medical",
      description:
        "Recognized for excellence in therapeutic and surgical dermatology, with a focus on early skin cancer detection and treatment.",
      tags: ["Skin Cancer Screening", "Eczema Care"],
    },
    {
      slug: "samuel-ortiz",
      name: "Dr. Samuel Ortiz",
      specialty: "Cosmetic Dermatology",
      rating: 4.4,
      reviewCount: 39,
      experienceYears: 6,
      location: "St. Mary's Medical",
      description: "Specializes in cosmetic and reconstructive skin treatments.",
    },
    {
      slug: "hana-kimura",
      name: "Dr. Hana Kimura",
      specialty: "Pediatric Dermatology",
      rating: 4.8,
      reviewCount: 61,
      experienceYears: 9,
      location: "St. Mary's Medical",
      description: "Focused on skin conditions unique to infants, children, and adolescents.",
    },
  ],
};

export function findDoctorBySlug(slug: string | null): Doctor | undefined {
  if (!slug) return undefined;
  for (const doctors of Object.values(DOCTORS_BY_DEPARTMENT)) {
    const found = doctors.find((d) => d.slug === slug);
    if (found) return found;
  }
  return undefined;
}
