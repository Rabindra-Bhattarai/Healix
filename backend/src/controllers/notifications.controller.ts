import { Request, Response } from "express";
import Notification from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ user: req.user!.id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ notifications });
});

export const unreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await Notification.countDocuments({ user: req.user!.id, read: false });
  res.json({ count });
});

export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user!.id });
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  notification.read = true;
  await notification.save();
  res.json({ notification });
});

export const markAllNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany({ user: req.user!.id, read: false }, { $set: { read: true } });
  res.json({ message: "All notifications marked as read" });
});
