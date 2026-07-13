import { Router } from "express";
import {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departments.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", protect, listDepartments);
router.post("/", protect, authorize("admin"), createDepartment);
router.put("/:id", protect, authorize("admin"), updateDepartment);
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

export default router;
