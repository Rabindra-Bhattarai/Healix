import { Schema, model, Document } from "mongoose";

export type DepartmentAvailability = "open" | "busy" | "closed";
export type DepartmentTone = "primary" | "secondary" | "tertiary" | "error";

export interface DepartmentDocument extends Document {
  name: string;
  slug: string;
  icon: string;
  tone: DepartmentTone;
  description: string;
  availability: DepartmentAvailability;
  meta: string;
}

const departmentSchema = new Schema<DepartmentDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  tone: { type: String, enum: ["primary", "secondary", "tertiary", "error"], required: true },
  description: { type: String, required: true },
  availability: { type: String, enum: ["open", "busy", "closed"], required: true, default: "open" },
  meta: { type: String, required: true },
});

export default model<DepartmentDocument>("Department", departmentSchema);
