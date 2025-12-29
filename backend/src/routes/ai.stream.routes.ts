import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { streamChatWithAI } from "../controllers/ai.stream.controller.js";

const router = express.Router();

// 🔒 protect all AI streaming routes
router.use(requireAuth);

router.post("/", streamChatWithAI);

export default router;
