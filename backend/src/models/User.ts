import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "patient" | "doctor" | "admin";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  bloodType?: string;
  allergies?: string;
  chronicConditions?: string;
  address?: string;
  dob?: string;
  gender?: string;
  resetOtpHash?: string;
  resetOtpExpiresAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSetupOtpHash?: string;
  twoFactorSetupOtpExpiresAt?: Date;
  twoFactorLoginOtpHash?: string;
  twoFactorLoginOtpExpiresAt?: Date;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], required: true, default: "patient" },
    avatarUrl: { type: String },
    bloodType: { type: String },
    allergies: { type: String },
    chronicConditions: { type: String },
    address: { type: String },
    dob: { type: String },
    gender: { type: String },
    resetOtpHash: { type: String },
    resetOtpExpiresAt: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSetupOtpHash: { type: String },
    twoFactorSetupOtpExpiresAt: { type: Date },
    twoFactorLoginOtpHash: { type: String },
    twoFactorLoginOtpExpiresAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<UserDocument>("User", userSchema);
