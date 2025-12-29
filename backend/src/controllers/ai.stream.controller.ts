import { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import { geminiModel } from "../config/gemini.js";
import Chat from "../models/Chat.js";

export const streamChatWithAI = async (req: Request, res: Response) => {
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

    // 🔥 STREAMING HEADERS (CRITICAL) - Set after validation
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    // 1️⃣ Save user message
    await Message.create({
      chatId,
      role: "user",
      content: message,
    });

    // 🔥 AUTO CHAT TITLE (ONLY ON FIRST USER MESSAGE)
    const userMessageCount = await Message.countDocuments({
      chatId,
      role: "user",
    });

    if (userMessageCount === 1) {
      await Chat.findByIdAndUpdate(chatId, {
        title: message.slice(0, 40),
      });
    }

    // 2️⃣ Build context
    const history = await Message.find({ chatId }).sort({ createdAt: 1 });
    const prompt = history.map((m) => `${m.role}: ${m.content}`).join("\n");

    // 3️⃣ Gemini streaming
    const result = await geminiModel.generateContentStream(prompt);

    let fullResponse = "";

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (!text) continue;

      fullResponse += text;

      res.write(text);
      res.flushHeaders(); // 🔥 FORCE SEND
      await new Promise((r) => setTimeout(r, 0)); // 🔥 YIELD EVENT LOOP
    }

    // 4️⃣ Save AI message
    await Message.create({
      chatId,
      role: "assistant",
      content: fullResponse,
    });

    res.end();
  } catch (error: any) {
    // If headers haven't been sent, send error response
    if (!res.headersSent) {
      res.status(500).json({ message: "Streaming failed", error: error.message });
    } else {
      // If streaming already started, just end the connection
      res.end();
    }
  }
};
