import { Request, Response } from "express";
import Department from "../models/Department";
import { asyncHandler } from "../utils/asyncHandler";

export const listDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json({ departments });
});

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.create(req.body);
  res.status(201).json({ department });
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!department) return res.status(404).json({ message: "Department not found" });
  res.json({ department });
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) return res.status(404).json({ message: "Department not found" });
  res.status(204).end();
});
