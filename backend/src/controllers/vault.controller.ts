import { Request, Response } from "express";
import VaultReport from "../models/VaultReport";
import Doctor from "../models/Doctor";
import Appointment from "../models/Appointment";
import { asyncHandler } from "../utils/asyncHandler";
import { notify } from "../utils/notify";

export const myVaultReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await VaultReport.find({ patient: req.user!.id }).sort({ date: -1 });
  res.json({ reports });
});

export const myAuthoredVaultReports = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user!.id });
  if (!doctor) return res.json({ reports: [] });
  const reports = await VaultReport.find({ orderedBy: doctor._id }).sort({ date: -1 });
  res.json({ reports });
});

export const getVaultReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await VaultReport.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });
  if (report.patient.toString() !== req.user!.id && req.user!.role === "patient") {
    return res.status(403).json({ message: "Not authorized to view this report" });
  }
  res.json({ report });
});

export const createVaultReport = asyncHandler(async (req: Request, res: Response) => {
  const { patientId, title, category, status, results } = req.body ?? {};
  if (!patientId || !title) {
    return res.status(400).json({ message: "patientId and title are required" });
  }

  const doctor = await Doctor.findOne({ user: req.user!.id });
  if (!doctor) return res.status(403).json({ message: "Not authorized" });

  const hasAppointment = await Appointment.exists({
    patient: patientId,
    doctor: doctor._id,
    status: { $ne: "Cancelled" },
  });
  if (!hasAppointment) {
    return res.status(403).json({ message: "You can only add reports for patients you have treated" });
  }

  const date = new Date();
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const report = await VaultReport.create({
    patient: patientId,
    title,
    category: category || "Lab Results",
    orderedBy: doctor._id,
    orderedByName: doctor.name,
    date,
    dateLabel,
    status: status || "Ready",
    results: results || [],
  });

  await notify({
    user: patientId,
    type: "vault_report_ready",
    icon: "biotech",
    tone: "secondary",
    text: `New report available: ${title} from ${doctor.name}.`,
    link: "/patient/vault",
  });

  res.status(201).json({ report });
});
