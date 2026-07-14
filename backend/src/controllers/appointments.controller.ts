import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import Counter from "../models/Counter";
import { asyncHandler } from "../utils/asyncHandler";
import { notify } from "../utils/notify";

// Atomically increments a per-day counter (keyed by dateLabel) so tokens start
// at 1, are never duplicated even under concurrent bookings, and never get
// reused just because an earlier appointment that day was cancelled. A new
// dateLabel each day naturally resets the sequence back to 1.
async function nextQueueToken(dateLabel: string) {
  const counter = await Counter.findOneAndUpdate(
    { key: dateLabel },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return String(counter.seq).padStart(3, "0");
}

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, date, dateLabel, time, reason } = req.body ?? {};
  if (!doctorId || !date || !dateLabel || !time) {
    return res.status(400).json({ message: "doctorId, date, dateLabel, and time are required" });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const queueToken = await nextQueueToken(dateLabel);

  const appointment = await Appointment.create({
    patient: req.user!.id,
    doctor: doctor._id,
    department: doctor.department,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    dateLabel,
    time,
    reason,
    status: "Confirmed",
    queueToken,
  });

  await notify({
    user: appointment.patient,
    type: "appointment_booked",
    icon: "event_available",
    tone: "primary",
    text: `Appointment confirmed with ${doctor.name} on ${dateLabel} at ${time}.`,
    link: "/patient/appointments",
  });

  res.status(201).json({ appointment });
});

export const myAppointments = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user!.id });
    if (!doctor) return res.json({ appointments: [] });
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone")
      .sort({ date: 1 });
    return res.json({ appointments });
  }

  const appointments = await Appointment.find({ patient: req.user!.id }).sort({ date: 1 });
  res.json({ appointments });
});

export const listAppointments = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.dateLabel) filter.dateLabel = req.query.dateLabel;
  if (req.query.status) filter.status = req.query.status;

  const appointments = await Appointment.find(filter)
    .populate("patient", "name email phone")
    .sort({ time: 1 });
  res.json({ appointments });
});

export const cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  if (appointment.patient.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not authorized to cancel this appointment" });
  }

  appointment.status = "Cancelled";
  await appointment.save();

  await notify({
    user: appointment.patient,
    type: "appointment_cancelled",
    icon: "event_busy",
    tone: "error",
    text: `Your appointment with ${appointment.doctorName} on ${appointment.dateLabel} has been cancelled.`,
    link: "/patient/appointments",
  });

  res.json({ appointment });
});

export const rescheduleAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { date, dateLabel, time } = req.body ?? {};
  if (!date || !dateLabel || !time) {
    return res.status(400).json({ message: "date, dateLabel, and time are required" });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  if (appointment.patient.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not authorized to reschedule this appointment" });
  }
  if (appointment.status !== "Confirmed") {
    return res.status(400).json({ message: "Only confirmed appointments can be rescheduled" });
  }

  // A queue token is your position in line for a specific day, so moving to a
  // new day means a fresh token for that day - never carry the old one over.
  if (dateLabel !== appointment.dateLabel) {
    appointment.queueToken = await nextQueueToken(dateLabel);
  }
  appointment.date = date;
  appointment.dateLabel = dateLabel;
  appointment.time = time;
  appointment.reminderSent = false;
  await appointment.save();

  await notify({
    user: appointment.patient,
    type: "appointment_rescheduled",
    icon: "event_repeat",
    tone: "secondary",
    text: `Your appointment with ${appointment.doctorName} has been rescheduled to ${dateLabel} at ${time}.`,
    link: "/patient/appointments",
  });

  res.json({ appointment });
});

export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body ?? {};
  if (!["Confirmed", "Cancelled", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });

  const doctor = await Doctor.findOne({ user: req.user!.id });
  if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this appointment" });
  }

  appointment.status = status;
  await appointment.save();

  if (status === "Completed") {
    await notify({
      user: appointment.patient,
      type: "appointment_completed",
      icon: "task_alt",
      tone: "secondary",
      text: `Your appointment with ${appointment.doctorName} is complete.`,
      link: "/patient/appointments",
    });
  } else if (status === "Cancelled") {
    await notify({
      user: appointment.patient,
      type: "appointment_cancelled",
      icon: "event_busy",
      tone: "error",
      text: `Your appointment with ${appointment.doctorName} on ${appointment.dateLabel} has been cancelled.`,
      link: "/patient/appointments",
    });
  }

  await appointment.populate("patient", "name email phone");
  res.json({ appointment });
});

export const getQueueStatus = asyncHandler(async (req: Request, res: Response) => {
  // Queue tokens are a single sequence per day across the whole hospital (see
  // nextQueueToken above), so "people ahead" is every other still-waiting
  // appointment that day with a lower token - not scoped to one doctor.
  const appointment = await Appointment.findOne({
    patient: req.user!.id,
    status: "Confirmed",
  }).sort({ date: 1 });

  if (!appointment) return res.json({ queue: null });

  const peopleAhead = await Appointment.countDocuments({
    dateLabel: appointment.dateLabel,
    status: "Confirmed",
    queueToken: { $lt: appointment.queueToken },
  });

  res.json({
    queue: {
      queueToken: appointment.queueToken,
      dateLabel: appointment.dateLabel,
      time: appointment.time,
      doctorName: appointment.doctorName,
      peopleAhead,
    },
  });
});
