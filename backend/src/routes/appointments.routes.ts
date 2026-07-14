import { Router } from "express";
import {
  createAppointment,
  myAppointments,
  listAppointments,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
  getQueueStatus,
} from "../controllers/appointments.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.post("/", protect, authorize("patient"), createAppointment);
router.get("/me", protect, myAppointments);
router.get("/queue-status", protect, authorize("patient"), getQueueStatus);
router.get("/", protect, authorize("admin"), listAppointments);
router.patch("/:id/cancel", protect, authorize("patient"), cancelAppointment);
router.patch("/:id/reschedule", protect, authorize("patient"), rescheduleAppointment);
router.patch("/:id/status", protect, authorize("doctor"), updateAppointmentStatus);

export default router;
