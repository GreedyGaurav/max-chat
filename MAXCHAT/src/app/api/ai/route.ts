import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAuthUserId } from '@/lib/auth';
import { geminiModel } from '@/lib/gemini';
import Chat from '@/lib/models/Chat';
import Message from '@/lib/models/Message';

export async function POST(req: NextRequest) {
  const userId = getAuthUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { chatId, message } = await req.json();

  if (!chatId || !message) {
    return NextResponse.json({ message: 'chatId and message required' }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return NextResponse.json({ message: 'Invalid chatId' }, { status: 400 });
  }

  await connectDB();

  const chat = await Chat.findById(chatId);
  if (!chat) return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  if (chat.userId.toString() !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await Message.create({ chatId, role: 'user', content: message });

  const history = await Message.find({ chatId }).sort({ createdAt: 1 });
  const prompt = history.map((m) => `${m.role}: ${m.content}`).join('\n');

  const result = await geminiModel.generateContent(prompt);
  const aiText = result.response.text();

  const aiMessage = await Message.create({ chatId, role: 'assistant', content: aiText });

  return NextResponse.json(aiMessage);
}
