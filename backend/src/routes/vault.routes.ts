import { Router } from "express";
import {
  myVaultReports,
  myAuthoredVaultReports,
  getVaultReport,
  createVaultReport,
} from "../controllers/vault.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/me", protect, myVaultReports);
router.get("/authored", protect, authorize("doctor"), myAuthoredVaultReports);
router.post("/", protect, authorize("doctor"), createVaultReport);
router.get("/:id", protect, getVaultReport);

export default router;
