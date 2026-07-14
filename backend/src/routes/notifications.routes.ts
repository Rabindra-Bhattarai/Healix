import { Router } from "express";
import {
  listNotifications,
  unreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notifications.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, listNotifications);
router.get("/unread-count", protect, unreadCount);
router.patch("/read-all", protect, markAllNotificationsAsRead);
router.patch("/:id/read", protect, markNotificationAsRead);

export default router;
