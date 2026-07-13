import { Request, Response } from "express";
import VaultReport from "../models/VaultReport";
import { asyncHandler } from "../utils/asyncHandler";

export const myVaultReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await VaultReport.find({ patient: req.user!.id }).sort({ date: -1 });
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
