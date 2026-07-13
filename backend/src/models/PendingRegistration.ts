import { Schema, model, Document } from "mongoose";

export interface PendingRegistrationDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  otpHash: string;
  expiresAt: Date;
}

const pendingRegistrationSchema = new Schema<PendingRegistrationDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB automatically deletes the document once expiresAt passes.
pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<PendingRegistrationDocument>("PendingRegistration", pendingRegistrationSchema);
