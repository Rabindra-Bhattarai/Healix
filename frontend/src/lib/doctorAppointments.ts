import { api } from "@/lib/api";
import { AppointmentStatus } from "@/lib/appointments";

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  date: string;
  dateLabel: string;
  time: string;
  status: AppointmentStatus;
  reason?: string;
  queueToken: string;
}

interface DoctorAppointmentRecord {
  _id: string;
  patient: { _id: string; name: string; email: string; phone?: string };
  date: string;
  dateLabel: string;
  time: string;
  status: AppointmentStatus;
  reason?: string;
  queueToken: string;
}

function toDoctorAppointment(record: DoctorAppointmentRecord): DoctorAppointment {
  return {
    id: record._id,
    patientId: record.patient._id,
    patientName: record.patient.name,
    patientEmail: record.patient.email,
    patientPhone: record.patient.phone,
    date: record.date,
    dateLabel: record.dateLabel,
    time: record.time,
    status: record.status,
    reason: record.reason,
    queueToken: record.queueToken,
  };
}

export function isToday(isoDate: string): boolean {
  return new Date(isoDate).toDateString() === new Date().toDateString();
}

export async function getMyDoctorAppointments(): Promise<DoctorAppointment[]> {
  const { appointments } = await api.get<{ appointments: DoctorAppointmentRecord[] }>(
    "/appointments/me"
  );
  return appointments.map(toDoctorAppointment);
}

export async function setAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<DoctorAppointment> {
  const { appointment } = await api.patch<{ appointment: DoctorAppointmentRecord }>(
    `/appointments/${id}/status`,
    { status }
  );
  return toDoctorAppointment(appointment);
}
