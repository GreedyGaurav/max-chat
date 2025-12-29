import { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { geminiModel } from "../config/gemini.js";

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ message: "chatId and message required" });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chatId" });
    }

    // 🔒 Verify chat belongs to user
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (chat.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: Chat does not belong to user" });
    }

    // 1️⃣ Save user message
    await Message.create({
      chatId,
      role: "user",
      content: message,
    });

    // 2️⃣ Fetch previous messages (context)
    const history = await Message.find({ chatId }).sort({ createdAt: 1 });

    const prompt = history.map((m) => `${m.role}: ${m.content}`).join("\n");

    // 3️⃣ Send to Gemini
    const result = await geminiModel.generateContent(prompt);
    const aiText = result.response.text();

    // 4️⃣ Save AI response
    const aiMessage = await Message.create({
      chatId,
      role: "assistant",
      content: aiText,
    });

    // 5️⃣ Send response to frontend
    res.json(aiMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI failed" });
  }
};
