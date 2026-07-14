import { Schema, model, Document, Types } from "mongoose";

export type DoctorReportStatus = "Open" | "Reviewed" | "Dismissed";
export type DoctorReportCategory =
  | "Unprofessional Behavior"
  | "Rude or Disrespectful"
  | "Misdiagnosis or Poor Care"
  | "Inappropriate Conduct"
  | "Other";

export interface DoctorReportDocument extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  doctorName: string;
  category: DoctorReportCategory;
  description: string;
  photoUrl?: string;
  status: DoctorReportStatus;
  createdAt: Date;
}

const doctorReportSchema = new Schema<DoctorReportDocument>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Unprofessional Behavior",
        "Rude or Disrespectful",
        "Misdiagnosis or Poor Care",
        "Inappropriate Conduct",
        "Other",
      ],
      required: true,
    },
    description: { type: String, required: true },
    photoUrl: { type: String },
    status: { type: String, enum: ["Open", "Reviewed", "Dismissed"], default: "Open" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<DoctorReportDocument>("DoctorReport", doctorReportSchema);
