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

  const userMsgCount = await Message.countDocuments({ chatId, role: 'user' });
  if (userMsgCount === 1) {
    await Chat.findByIdAndUpdate(chatId, { title: message.slice(0, 40) });
  }

  const history = await Message.find({ chatId }).sort({ createdAt: 1 });
  const prompt = history.map((m) => `${m.role}: ${m.content}`).join('\n');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await geminiModel.generateContentStream(prompt);
        let fullResponse = '';

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (!text) continue;
          fullResponse += text;
          controller.enqueue(encoder.encode(text));
        }

        await Message.create({ chatId, role: 'assistant', content: fullResponse });
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
