import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAuthUserId } from '@/lib/auth';
import Chat from '@/lib/models/Chat';
import Message from '@/lib/models/Message';

export async function POST(req: NextRequest) {
  const userId = getAuthUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { chatId, role, content } = await req.json();

  if (!chatId || !role || !content) {
    return NextResponse.json(
      { message: 'chatId, role and content are required' },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return NextResponse.json({ message: 'Invalid chatId' }, { status: 400 });
  }

  if (!['user', 'assistant'].includes(role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  await connectDB();

  const chat = await Chat.findById(chatId);
  if (!chat) return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  if (chat.userId.toString() !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const message = await Message.create({ chatId, role, content });

  if (role === 'user') {
    const count = await Message.countDocuments({ chatId, role: 'user' });
    if (count === 1) {
      await Chat.findByIdAndUpdate(chatId, { title: content.slice(0, 40) });
    }
  }

  return NextResponse.json(message, { status: 201 });
}
