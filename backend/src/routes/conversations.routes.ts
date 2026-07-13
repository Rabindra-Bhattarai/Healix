import { Router } from "express";
import {
  listConversations,
  startConversation,
  listMessages,
  sendMessage,
} from "../controllers/conversations.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", protect, listConversations);
router.post("/", protect, authorize("patient"), startConversation);
router.get("/:id/messages", protect, listMessages);
router.post("/:id/messages", protect, sendMessage);

export default router;
