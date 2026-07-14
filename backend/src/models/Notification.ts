import { Schema, model, Document, Types } from "mongoose";

export type NotificationType =
  | "appointment_booked"
  | "appointment_cancelled"
  | "appointment_rescheduled"
  | "appointment_completed"
  | "appointment_reminder"
  | "message"
  | "vault_report_ready";

export type NotificationTone = "primary" | "secondary" | "tertiary" | "error";

export interface NotificationDocument extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  icon: string;
  tone: NotificationTone;
  text: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "appointment_booked",
        "appointment_cancelled",
        "appointment_rescheduled",
        "appointment_completed",
        "appointment_reminder",
        "message",
        "vault_report_ready",
      ],
      required: true,
    },
    icon: { type: String, required: true },
    tone: { type: String, enum: ["primary", "secondary", "tertiary", "error"], default: "primary" },
    text: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<NotificationDocument>("Notification", notificationSchema);
