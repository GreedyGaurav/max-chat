import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createChat,
  getChats,
  deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

// 🔒 protect all chat routes
router.use(requireAuth);

router.post("/", createChat);
router.get("/", getChats);
router.delete("/:chatId", deleteChat);

export default router;
