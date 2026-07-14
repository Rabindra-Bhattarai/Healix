import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import User from "../models/User";
import Department from "../models/Department";
import Doctor from "../models/Doctor";
import Appointment from "../models/Appointment";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import VaultReport from "../models/VaultReport";
import Counter from "../models/Counter";

const DEMO_PASSWORD = "password123";

const DEPARTMENTS = [
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
  {
    slug: "emergency-medicine",
    name: "Emergency Medicine",
    icon: "emergency",
    tone: "error",
    description:
      "Round-the-clock trauma and urgent care for acute illness and injury, staffed for rapid triage and stabilization.",
    availability: "open",
    meta: "Estimated wait: 10 mins",
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    icon: "orthopedics",
    tone: "tertiary",
    description:
      "Diagnosis and treatment of bone, joint, and muscle conditions, from sports injuries to joint replacement.",
    availability: "open",
    meta: "Estimated wait: 25 mins",
  },
  {
    slug: "general-surgery",
    name: "General Surgery",
    icon: "medical_services",
    tone: "primary",
    description:
      "Surgical evaluation and procedures spanning abdominal, soft-tissue, and minimally invasive operations.",
    availability: "busy",
    meta: "Estimated wait: 40 mins",
  },
  {
    slug: "obstetrics-gynecology",
    name: "Obstetrics & Gynecology",
    icon: "pregnant_woman",
    tone: "secondary",
    description:
      "Comprehensive women's health care covering prenatal visits, delivery, and gynecological wellness.",
    availability: "open",
    meta: "Estimated wait: 20 mins",
  },
  {
    slug: "ophthalmology",
    name: "Ophthalmology",
    icon: "visibility",
    tone: "tertiary",
    description:
      "Complete eye care including vision testing, treatment of eye disease, and surgical procedures.",
    availability: "open",
    meta: "Estimated wait: 15 mins",
  },
  {
    slug: "ent",
    name: "ENT (Otolaryngology)",
    icon: "hearing",
    tone: "primary",
    description:
      "Specialized care for ear, nose, and throat conditions, including hearing and sinus disorders.",
    availability: "open",
    meta: "Estimated wait: 20 mins",
  },
  {
    slug: "psychiatry",
    name: "Psychiatry",
    icon: "psychiatry",
    tone: "secondary",
    description:
      "Confidential mental health evaluation, therapy, and medication management for patients of all ages.",
    availability: "open",
    meta: "Estimated wait: 30 mins",
  },
  {
    slug: "oncology",
    name: "Oncology",
    icon: "oncology",
    tone: "error",
    description:
      "Cancer screening, diagnosis, and treatment planning delivered by a multidisciplinary care team.",
    availability: "open",
    meta: "Estimated wait: 25 mins",
  },
  {
    slug: "gastroenterology",
    name: "Gastroenterology",
    icon: "gastroenterology",
    tone: "primary",
    description:
      "Digestive system care including endoscopy and treatment of stomach, liver, and intestinal conditions.",
    availability: "busy",
    meta: "Estimated wait: 35 mins",
  },
  {
    slug: "pulmonology",
    name: "Pulmonology",
    icon: "pulmonology",
    tone: "secondary",
    description:
      "Diagnosis and management of respiratory conditions affecting the lungs and airways.",
    availability: "open",
    meta: "Estimated wait: 20 mins",
  },
  {
    slug: "nephrology",
    name: "Nephrology",
    icon: "nephrology",
    tone: "tertiary",
    description:
      "Kidney health care including chronic kidney disease management and dialysis coordination.",
    availability: "open",
    meta: "Estimated wait: 20 mins",
  },
  {
    slug: "radiology",
    name: "Radiology",
    icon: "radiology",
    tone: "error",
    description:
      "Diagnostic imaging services including X-ray, ultrasound, CT, and MRI for accurate clinical insight.",
    availability: "open",
    meta: "Estimated wait: 15 mins",
  },
] as const;

const DOCTORS_BY_DEPARTMENT: Record<string, Array<{
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  location: string;
  description: string;
  tags?: string[];
}>> = {
  cardiology: [
    {
      slug: "sarah-jenkins",
      name: "Dr. Sarah Jenkins, MD",
      specialty: "Senior Cardiologist",
      rating: 4.9,
      reviewCount: 124,
      experienceYears: 15,
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
      description: "Specialized care for newborns, including premature and critically ill infants.",
    },
    {
      slug: "priya-nair",
      name: "Dr. Priya Nair",
      specialty: "Adolescent Medicine",
      rating: 4.5,
      reviewCount: 52,
      experienceYears: 7,
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
      description: "Expert in nerve conduction studies and electromyography for complex neurological cases.",
    },
    {
      slug: "daniel-osei",
      name: "Dr. Daniel Osei",
      specialty: "Stroke & Vascular Neurology",
      rating: 4.7,
      reviewCount: 61,
      experienceYears: 11,
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
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
      location: "Tribhuvan University Teaching Hospital",
      description: "Specializes in cosmetic and reconstructive skin treatments.",
    },
    {
      slug: "hana-kimura",
      name: "Dr. Hana Kimura",
      specialty: "Pediatric Dermatology",
      rating: 4.8,
      reviewCount: 61,
      experienceYears: 9,
      location: "Tribhuvan University Teaching Hospital",
      description: "Focused on skin conditions unique to infants, children, and adolescents.",
    },
  ],
};

async function run() {
  await connectDB();

  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    Appointment.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    VaultReport.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("Seeding departments...");
  const departmentDocs = await Department.insertMany(DEPARTMENTS);
  const departmentBySlug = new Map(departmentDocs.map((d) => [d.slug, d]));

  console.log("Seeding doctors + their user accounts...");
  for (const [deptSlug, doctors] of Object.entries(DOCTORS_BY_DEPARTMENT)) {
    const department = departmentBySlug.get(deptSlug);
    if (!department) continue;

    for (const doc of doctors) {
      const email = `${doc.slug.replace(/-/g, ".")}@healix.com`;
      const user = await User.create({
        name: doc.name,
        email,
        phone: "+1 (555) 010-1000",
        passwordHash,
        role: "doctor",
      });

      await Doctor.create({
        user: user._id,
        department: department._id,
        slug: doc.slug,
        name: doc.name,
        specialty: doc.specialty,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        experienceYears: doc.experienceYears,
        location: doc.location,
        description: doc.description,
        tags: doc.tags ?? [],
      });
    }
  }

  console.log("Seeding demo patient and admin...");
  const patient = await User.create({
    name: "Julian Moore",
    email: "patient@healix.com",
    phone: "+1 (555) 234-5678",
    passwordHash,
    role: "patient",
    bloodType: "A+",
    allergies: "Penicillin, Seasonal Pollen",
    chronicConditions: "",
    address: "782 Mission Heights Blvd, Apt 4C, San Francisco, CA 94105",
    dob: "1994-03-12",
    gender: "male",
  });

  await User.create({
    name: "Healix Admin",
    email: "admin@healix.com",
    phone: "+1 (555) 999-0000",
    passwordHash,
    role: "admin",
  });

  const cardiologist = await Doctor.findOne({ slug: "sarah-jenkins" });
  if (cardiologist) {
    const todayLabel = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    // Keep the Counter collection in sync so any real booking made today
    // continues the sequence (002, 003, ...) instead of colliding with this one.
    const counter = await Counter.findOneAndUpdate(
      { key: todayLabel },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    await Appointment.create({
      patient: patient._id,
      doctor: cardiologist._id,
      department: cardiologist.department,
      doctorName: cardiologist.name,
      specialty: cardiologist.specialty,
      date: new Date(),
      dateLabel: todayLabel,
      time: "10:00 AM",
      status: "Confirmed",
      queueToken: String(counter.seq).padStart(3, "0"),
    });

    const conversation = await Conversation.create({
      patient: patient._id,
      doctor: cardiologist._id,
      lastMessageAt: new Date(),
    });
    await Message.create({
      conversation: conversation._id,
      sender: cardiologist.user,
      senderRole: "doctor",
      text: "Hi Julian, looking forward to your visit. Let me know if you have any questions beforehand.",
    });

    await VaultReport.create({
      patient: patient._id,
      title: "Comprehensive Blood Panel",
      category: "Lab Results",
      orderedBy: cardiologist._id,
      orderedByName: cardiologist.name,
      date: new Date(),
      dateLabel: "Oct 24, 2023",
      status: "Ready",
      fileSize: "1.2 MB",
      results: [
        { testName: "Glucose", result: "92", flag: "NORMAL", referenceRange: "65 - 99", units: "mg/dL" },
        { testName: "Total Cholesterol", result: "188", flag: "NORMAL", referenceRange: "< 200", units: "mg/dL" },
      ],
    });
  }

  console.log("\nSeed complete. Demo accounts (password: %s):", DEMO_PASSWORD);
  console.log("  patient@healix.com");
  console.log("  sarah.jenkins@healix.com (and any other doctor slug @healix.com)");
  console.log("  admin@healix.com");

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
