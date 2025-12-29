import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

// 🔒 protect all AI routes
router.use(requireAuth);

router.post("/", chatWithAI);

export default router;
