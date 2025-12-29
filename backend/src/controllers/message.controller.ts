import Chat from "../models/Chat.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";

// SAVE MESSAGE (user or assistant)
export const createMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { chatId, role, content } = req.body;

    // basic validations
    if (!chatId || !role || !content) {
      return res
        .status(400)
        .json({ message: "chatId, role and content are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chatId" });
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 🔒 Verify chat belongs to user
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (chat.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: Chat does not belong to user" });
    }

    const message = await Message.create({
      chatId,
      role,
      content,
    });

    // 🔥 AUTO CHAT TITLE (ONLY ON FIRST USER MESSAGE)
    if (role === "user") {
      const userMessageCount = await Message.countDocuments({
        chatId,
        role: "user",
      });

      // only first user message sets title
      if (userMessageCount === 1) {
        await Chat.findByIdAndUpdate(chatId, {
          title: content.slice(0, 40),
        });
      }
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to create message" });
  }
};

// GET ALL MESSAGES OF A CHAT (CHAT HISTORY)
export const getMessagesByChat = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { chatId } = req.params;

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

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
