import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAuthUserId } from '@/lib/auth';
import Chat from '@/lib/models/Chat';
import Message from '@/lib/models/Message';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const userId = getAuthUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { chatId } = await params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return NextResponse.json({ message: 'Invalid chatId' }, { status: 400 });
  }

  await connectDB();

  const chat = await Chat.findById(chatId);
  if (!chat) return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  if (chat.userId.toString() !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
  return NextResponse.json(messages);
}
