import { Request, Response } from "express";
import Chat from "../models/Chat.js";

// CREATE NEW CHAT
export const createChat = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chat = await Chat.create({
      userId,
      title: title || "New Chat",
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to create chat" });
  }
};

// GET ALL CHATS (LOGGED-IN USER)
export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json({ chats });
  } catch {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

// DELETE CHAT
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    await Chat.findByIdAndDelete(chatId);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
