import { Schema, model, Document, Types } from "mongoose";

export type AppointmentStatus = "Confirmed" | "Cancelled" | "Completed";

export interface AppointmentDocument extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  department: Types.ObjectId;
  doctorName: string;
  specialty: string;
  date: Date;
  dateLabel: string;
  time: string;
  status: AppointmentStatus;
  reason?: string;
  queueToken: string;
  reminderSent: boolean;
  createdAt: Date;
}

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String, required: true },
    date: { type: Date, required: true },
    dateLabel: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Confirmed", "Cancelled", "Completed"], default: "Confirmed" },
    reason: { type: String },
    queueToken: { type: String, required: true },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<AppointmentDocument>("Appointment", appointmentSchema);
