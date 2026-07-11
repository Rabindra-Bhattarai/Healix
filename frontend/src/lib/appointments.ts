export type AppointmentStatus = "Confirmed" | "Cancelled" | "Completed";

export interface BookedAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateLabel: string;
  time: string;
  status: AppointmentStatus;
  queueToken: string;
}

const STORAGE_KEY = "healix.appointments";

export function getAppointments(): BookedAppointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookedAppointment[]) : [];
  } catch {
    return [];
  }
}

export function addAppointment(
  appointment: Omit<BookedAppointment, "id" | "queueToken">,
): BookedAppointment {
  const existing = getAppointments();
  const queueToken = String(42 + existing.length).padStart(3, "0");
  const withId: BookedAppointment = { ...appointment, id: crypto.randomUUID(), queueToken };
  const next = [withId, ...existing];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return withId;
}

export function cancelAppointment(id: string): void {
  const next = getAppointments().map((a) => (a.id === id ? { ...a, status: "Cancelled" as const } : a));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

export function getActiveQueueAppointment(): BookedAppointment | undefined {
  return getAppointments().find((a) => a.status === "Confirmed");
}

export interface MessageableDoctor {
  doctorName: string;
  specialty: string;
}

export function getMessageableDoctors(): MessageableDoctor[] {
  const seen = new Set<string>();
  const doctors: MessageableDoctor[] = [];
  for (const appt of getAppointments()) {
    if (appt.status === "Cancelled") continue;
    if (seen.has(appt.doctorName)) continue;
    seen.add(appt.doctorName);
    doctors.push({ doctorName: appt.doctorName, specialty: appt.specialty });
  }
  return doctors;
}
