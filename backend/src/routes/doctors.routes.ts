import { Router } from "express";
import {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateMyDoctorProfile,
} from "../controllers/doctors.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", protect, listDoctors);
router.patch("/me", protect, authorize("doctor"), updateMyDoctorProfile);
router.get("/:id", protect, getDoctor);
router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, authorize("admin"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

export default router;
