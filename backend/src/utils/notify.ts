import { Types } from "mongoose";
import Notification, { NotificationTone, NotificationType } from "../models/Notification";

export async function notify(params: {
  user: Types.ObjectId | string;
  type: NotificationType;
  icon: string;
  tone?: NotificationTone;
  text: string;
  link?: string;
}) {
  try {
    await Notification.create({ ...params, tone: params.tone ?? "primary" });
  } catch (err) {
    console.error("[notify] failed to create notification", err);
  }
}
