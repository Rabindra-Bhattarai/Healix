import { Router } from "express";
import { myVaultReports, getVaultReport } from "../controllers/vault.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/me", protect, myVaultReports);
router.get("/:id", protect, getVaultReport);

export default router;
