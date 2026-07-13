import { Router } from "express";
import { triageChat } from "../controllers/triage.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.post("/chat", protect, authorize("patient"), triageChat);

export default router;
