import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createMessage,
  getMessagesByChat,
} from "../controllers/message.controller.js";

const router = express.Router();

// 🔒 protect all message routes
router.use(requireAuth);

router.post("/", createMessage); // save message
router.get("/:chatId", getMessagesByChat); // fetch chat history

export default router;
