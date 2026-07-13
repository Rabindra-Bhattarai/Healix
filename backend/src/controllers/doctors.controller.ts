import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor";
import Department from "../models/Department";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const listDoctors = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.department) {
    const department = await Department.findOne({ slug: req.query.department });
    if (!department) return res.json({ doctors: [] });
    filter.department = department._id;
  }

  const doctors = await Doctor.find(filter).sort({ rating: -1 });
  res.json({ doctors });
});

export const getDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json({ doctor });
});

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    password,
    departmentSlug,
    specialty,
    experienceYears,
    location,
    description,
    tags,
  } = req.body ?? {};

  if (!name || !email || !password || !departmentSlug || !specialty) {
    return res.status(400).json({
      message: "name, email, password, departmentSlug, and specialty are required",
    });
  }

  const department = await Department.findOne({ slug: departmentSlug });
  if (!department) return res.status(400).json({ message: "Unknown departmentSlug" });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash, role: "doctor" });

  const doctor = await Doctor.create({
    user: user._id,
    department: department._id,
    slug: slugify(name),
    name,
    specialty,
    experienceYears: experienceYears ?? 1,
    location,
    description,
    tags,
  });

  res.status(201).json({ doctor });
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json({ doctor });
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  await User.findByIdAndDelete(doctor.user);
  res.status(204).end();
});
