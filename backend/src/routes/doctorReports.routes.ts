import { Router } from "express";
import {
  createDoctorReport,
  listDoctorReports,
  updateDoctorReportStatus,
} from "../controllers/doctorReports.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.post("/", protect, authorize("patient"), createDoctorReport);
router.get("/", protect, authorize("admin"), listDoctorReports);
router.patch("/:id/status", protect, authorize("admin"), updateDoctorReportStatus);

export default router;
