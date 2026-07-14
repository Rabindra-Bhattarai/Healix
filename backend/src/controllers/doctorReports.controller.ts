import { Request, Response } from "express";
import DoctorReport from "../models/DoctorReport";
import Doctor from "../models/Doctor";
import Appointment from "../models/Appointment";
import { asyncHandler } from "../utils/asyncHandler";

export const createDoctorReport = asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, category, description, photoUrl } = req.body ?? {};
  if (!doctorId || !category || !description) {
    return res.status(400).json({ message: "doctorId, category, and description are required" });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const hasAppointment = await Appointment.exists({
    patient: req.user!.id,
    doctor: doctor._id,
    status: { $ne: "Cancelled" },
  });
  if (!hasAppointment) {
    return res.status(403).json({ message: "You can only report doctors you have been treated by" });
  }

  const report = await DoctorReport.create({
    patient: req.user!.id,
    doctor: doctor._id,
    doctorName: doctor.name,
    category,
    description,
    photoUrl: photoUrl || undefined,
  });

  res.status(201).json({ report });
});

export const listDoctorReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await DoctorReport.find()
    .populate("patient", "name email")
    .sort({ createdAt: -1 });
  res.json({ reports });
});

export const updateDoctorReportStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body ?? {};
  if (!["Open", "Reviewed", "Dismissed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const report = await DoctorReport.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!report) return res.status(404).json({ message: "Report not found" });
  res.json({ report });
});
