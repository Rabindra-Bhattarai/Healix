import { api } from "@/lib/api";

export type AppointmentStatus = "Confirmed" | "Cancelled" | "Completed";

export interface BookedAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  dateLabel: string;
  time: string;
  status: AppointmentStatus;
  queueToken: string;
  reason?: string;
}

export interface MessageableDoctor {
  doctorId: string;
  doctorName: string;
  specialty: string;
}

interface AppointmentRecord {
  _id: string;
  doctor: string;
  doctorName: string;
  specialty: string;
  date: string;
  dateLabel: string;
  time: string;
  status: AppointmentStatus;
  queueToken: string;
  reason?: string;
}

function toBooked(record: AppointmentRecord): BookedAppointment {
  return {
    id: record._id,
    doctorId: record.doctor,
    doctorName: record.doctorName,
    specialty: record.specialty,
    date: record.date,
    dateLabel: record.dateLabel,
    time: record.time,
    status: record.status,
    queueToken: record.queueToken,
    reason: record.reason,
  };
}

export async function getAppointments(): Promise<BookedAppointment[]> {
  const { appointments } = await api.get<{ appointments: AppointmentRecord[] }>("/appointments/me");
  return appointments.map(toBooked);
}

export async function addAppointment(input: {
  doctorId: string;
  date: string;
  dateLabel: string;
  time: string;
  reason?: string;
}): Promise<BookedAppointment> {
  const { appointment } = await api.post<{ appointment: AppointmentRecord }>("/appointments", input);
  return toBooked(appointment);
}

export async function cancelAppointment(id: string): Promise<void> {
  await api.patch(`/appointments/${id}/cancel`);
}

export async function rescheduleAppointment(
  id: string,
  input: { date: string; dateLabel: string; time: string }
): Promise<BookedAppointment> {
  const { appointment } = await api.patch<{ appointment: AppointmentRecord }>(
    `/appointments/${id}/reschedule`,
    input
  );
  return toBooked(appointment);
}

export async function getActiveQueueAppointment(): Promise<BookedAppointment | undefined> {
  const appointments = await getAppointments();
  return appointments.find((a) => a.status === "Confirmed");
}

export interface AdminAppointment extends BookedAppointment {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
}

interface AdminAppointmentRecord extends AppointmentRecord {
  patient: { _id: string; name: string; email: string; phone?: string };
}

export async function getAllAppointmentsAdmin(filters?: {
  dateLabel?: string;
  status?: AppointmentStatus;
}): Promise<AdminAppointment[]> {
  const params = new URLSearchParams();
  if (filters?.dateLabel) params.set("dateLabel", filters.dateLabel);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();

  const { appointments } = await api.get<{ appointments: AdminAppointmentRecord[] }>(
    `/appointments${query ? `?${query}` : ""}`
  );
  return appointments.map((record) => ({
    ...toBooked(record),
    patientName: record.patient.name,
    patientEmail: record.patient.email,
    patientPhone: record.patient.phone,
  }));
}

export interface QueueStatus {
  queueToken: string;
  dateLabel: string;
  time: string;
  doctorName: string;
  peopleAhead: number;
}

export async function getQueueStatus(): Promise<QueueStatus | null> {
  const { queue } = await api.get<{ queue: QueueStatus | null }>("/appointments/queue-status");
  return queue;
}

export async function getMessageableDoctors(): Promise<MessageableDoctor[]> {
  const { appointments } = await api.get<{ appointments: AppointmentRecord[] }>("/appointments/me");
  const seen = new Map<string, MessageableDoctor>();
  appointments
    .filter((a) => a.status !== "Cancelled")
    .forEach((a) => {
      if (!seen.has(a.doctor)) {
        seen.set(a.doctor, { doctorId: a.doctor, doctorName: a.doctorName, specialty: a.specialty });
      }
    });
  return Array.from(seen.values());
}
