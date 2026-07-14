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

async function withUserContact<T extends { user: unknown }>(doctors: T[]) {
  const userIds = doctors.map((d) => d.user);
  const users = await User.find({ _id: { $in: userIds } }, "email phone");
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));
  return doctors.map((d) => {
    const user = userMap.get(String(d.user));
    return { ...d, email: user?.email, phone: user?.phone };
  });
}

export const listDoctors = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.department) {
    const department = await Department.findOne({ slug: req.query.department });
    if (!department) return res.json({ doctors: [] });
    filter.department = department._id;
  }

  const doctors = await Doctor.find(filter)
    .populate("department", "name slug")
    .sort({ rating: -1 })
    .lean();
  res.json({ doctors: await withUserContact(doctors) });
});

export const getDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id).populate("department", "name slug").lean();
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  const [enriched] = await withUserContact([doctor]);
  res.json({ doctor: enriched });
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
  await doctor.populate("department", "name slug");

  res.status(201).json({ doctor: { ...doctor.toObject(), email: user.email, phone: user.phone } });
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const { phone, email, password, departmentSlug, ...doctorFields } = req.body ?? {};

  if (departmentSlug) {
    const department = await Department.findOne({ slug: departmentSlug });
    if (!department) return res.status(400).json({ message: "Unknown departmentSlug" });
    doctorFields.department = department._id;
  }

  Object.assign(doctor, doctorFields);
  await doctor.save();

  // email/phone/password live on the linked User account, not the Doctor document.
  const userUpdates: Record<string, unknown> = {};
  if (phone !== undefined) userUpdates.phone = phone;
  if (email !== undefined) {
    const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: doctor.user } });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });
    userUpdates.email = email;
  }
  if (password) {
    userUpdates.passwordHash = await bcrypt.hash(password, 10);
  }
  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(doctor.user, userUpdates);
  }

  await doctor.populate("department", "name slug");
  const user = await User.findById(doctor.user, "email phone");
  res.json({ doctor: { ...doctor.toObject(), email: user?.email, phone: user?.phone } });
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  await User.findByIdAndDelete(doctor.user);
  res.status(204).end();
});

const DOCTOR_SELF_UPDATABLE_FIELDS = [
  "specialty",
  "description",
  "tags",
  "experienceYears",
  "location",
] as const;

export const updateMyDoctorProfile = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user!.id });
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

  for (const field of DOCTOR_SELF_UPDATABLE_FIELDS) {
    if (req.body?.[field] !== undefined) {
      (doctor as unknown as Record<string, unknown>)[field] = req.body[field];
    }
  }

  await doctor.save();
  res.json({ doctor });
});
