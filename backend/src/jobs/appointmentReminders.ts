import Appointment from "../models/Appointment";
import { notify } from "../utils/notify";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const REMINDER_WINDOW_MS = 2 * 60 * 60 * 1000;

function parseApptDateTime(date: Date, time: string): Date | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

async function checkReminders() {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MS);
  const candidates = await Appointment.find({ status: "Confirmed", reminderSent: { $ne: true } });

  for (const appointment of candidates) {
    const apptDateTime = parseApptDateTime(appointment.date, appointment.time);
    if (!apptDateTime || apptDateTime <= now || apptDateTime > windowEnd) continue;

    await notify({
      user: appointment.patient,
      type: "appointment_reminder",
      icon: "calendar_clock",
      tone: "primary",
      text: `Reminder: your appointment with ${appointment.doctorName} is at ${appointment.time} today.`,
      link: "/patient/appointments",
    });
    appointment.reminderSent = true;
    await appointment.save();
  }
}

export function startAppointmentReminderJob() {
  checkReminders().catch((err) => console.error("[reminders] initial check failed", err));
  setInterval(() => {
    checkReminders().catch((err) => console.error("[reminders] check failed", err));
  }, CHECK_INTERVAL_MS);
}
