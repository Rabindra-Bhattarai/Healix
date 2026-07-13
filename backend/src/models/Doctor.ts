import { Schema, model, Document, Types } from "mongoose";

export interface DoctorDocument extends Document {
  user: Types.ObjectId;
  department: Types.ObjectId;
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  location: string;
  description: string;
  tags: string[];
}

const doctorSchema = new Schema<DoctorDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 1 },
  location: { type: String, default: "Tribhuvan University Teaching Hospital" },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
});

export default model<DoctorDocument>("Doctor", doctorSchema);
